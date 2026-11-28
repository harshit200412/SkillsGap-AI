"""Registration, login, refresh, logout, and identity endpoints."""

import logging
import re
from datetime import datetime, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.app import auth, models
from backend.app.auth_email import (
    is_configured as auth_email_is_configured,
    send_password_reset_email,
    send_verification_email,
)
from backend.app.database import SessionLocal
from backend.app.rate_limits import limiter


router = APIRouter(prefix="/api/auth", tags=["authentication"])
bearer_scheme = HTTPBearer(auto_error=False)
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
logger = logging.getLogger(__name__)


class Credentials(BaseModel):
    email: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if not EMAIL_PATTERN.fullmatch(normalized):
            raise ValueError("Enter a valid email address")
        return normalized


class RegistrationRequest(Credentials):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)

    @field_validator("first_name", "last_name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = " ".join(value.split())
        if not normalized:
            raise ValueError("Enter your first and last name")
        return normalized


class NameUpdateRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)

    @field_validator("first_name", "last_name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = " ".join(value.split())
        if not normalized:
            raise ValueError("Enter your first and last name")
        return normalized


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=32, max_length=256)


class EmailRequest(BaseModel):
    email: str = Field(min_length=3, max_length=320)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if not EMAIL_PATTERN.fullmatch(normalized):
            raise ValueError("Enter a valid email address")
        return normalized


class ActionTokenRequest(BaseModel):
    token: str = Field(min_length=32, max_length=256)


class PasswordResetRequest(ActionTokenRequest):
    new_password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    created_at: datetime
    first_name: str = ""
    last_name: str = ""


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = auth.ACCESS_TOKEN_MINUTES * 60
    user: UserResponse


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def issue_tokens(user: models.User, db: Session) -> TokenResponse:
    refresh_token = auth.create_refresh_token()
    session = models.AuthSession(
        user_id=user.id,
        refresh_token_hash=auth.hash_refresh_token(refresh_token),
        expires_at=auth.refresh_token_expiry(),
    )
    db.add(session)
    db.commit()
    profile = db.get(models.UserProfile, user.id)
    return TokenResponse(
        access_token=auth.create_access_token(user.id, session.id),
        refresh_token=refresh_token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            created_at=user.created_at,
            first_name=profile.first_name if profile else "",
            last_name=profile.last_name if profile else "",
        ),
    )


def issue_action_token(user: models.User, purpose: str, db: Session) -> str:
    now = datetime.now(timezone.utc)
    db.query(models.AuthActionToken).filter(
        models.AuthActionToken.user_id == user.id,
        models.AuthActionToken.purpose == purpose,
        models.AuthActionToken.consumed_at.is_(None),
    ).update({"consumed_at": now}, synchronize_session=False)
    token = auth.create_action_token()
    db.add(
        models.AuthActionToken(
            user_id=user.id,
            purpose=purpose,
            token_hash=auth.hash_action_token(token),
            expires_at=auth.action_token_expiry(purpose),
        )
    )
    db.flush()
    return token


def email_is_verified(user_id: int, db: Session) -> bool:
    return db.get(models.UserEmailVerification, user_id) is not None


def get_authenticated_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired access token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        if credentials is None:
            raise jwt.InvalidTokenError("Missing bearer token")
        user_id, session_id = auth.decode_access_token(credentials.credentials)
    except jwt.InvalidTokenError:
        raise unauthorized
    user = db.get(models.User, user_id)
    if user is None:
        raise unauthorized
    active_session = db.query(models.AuthSession.id).filter(
        models.AuthSession.id == session_id,
        models.AuthSession.user_id == user_id,
        models.AuthSession.revoked_at.is_(None),
        models.AuthSession.expires_at > datetime.now(timezone.utc),
    ).first()
    if active_session is None:
        raise unauthorized
    return user


def get_current_user(user: models.User = Depends(get_authenticated_user), db: Session = Depends(get_db)) -> models.User:
    if auth.REQUIRE_EMAIL_VERIFICATION and not email_is_verified(user.id, db):
        raise HTTPException(status_code=403, detail="Verify your email before using this account.")
    return user


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(request: Request, credentials: RegistrationRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter_by(email=credentials.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    # Registration must never silently succeed without sending the verification email.
    # This also makes local development report missing SMTP configuration clearly.
    if not auth_email_is_configured():
        raise HTTPException(
            status_code=503,
            detail="Email delivery is not configured. Configure SMTP_HOST and SMTP_FROM_EMAIL, then try again.",
        )

    user = models.User(
        email=credentials.email,
        password_hash=auth.hash_password(credentials.password),
    )
    db.add(user)
    try:
        db.flush()
    except IntegrityError as exc:
        db.rollback()
        if db.query(models.User).filter_by(email=credentials.email).first():
            raise HTTPException(status_code=409, detail="An account with this email already exists")
        raise
    db.add(models.UserProfile(
        user_id=user.id,
        first_name=credentials.first_name,
        last_name=credentials.last_name,
    ))
    try:
        verification_token = issue_action_token(user, "verify_email", db)
        send_verification_email(user.email, verification_token)
    except Exception as exc:
        logger.exception("Failed to send verification email during registration.")
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="Could not send verification email. Check the backend SMTP configuration and logs, then try again.",
        ) from exc

    response = issue_tokens(user, db)
    return response


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, credentials: Credentials, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=credentials.email).first()
    if user is None or not auth.verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if auth.REQUIRE_EMAIL_VERIFICATION and not email_is_verified(user.id, db):
        raise HTTPException(status_code=403, detail="Verify your email before signing in.")
    return issue_tokens(user, db)


@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("10/minute")
def refresh_tokens(request: Request, body: RefreshRequest, db: Session = Depends(get_db)):
    token_hash = auth.hash_refresh_token(body.refresh_token)
    session = (
        db.query(models.AuthSession)
        .filter_by(refresh_token_hash=token_hash)
        .with_for_update()
        .first()
    )
    now = datetime.now(timezone.utc)
    if session is None or session.revoked_at is not None:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    expires_at = session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= now:
        session.revoked_at = now
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user = db.get(models.User, session.user_id)
    if user is None:
        session.revoked_at = now
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    if auth.REQUIRE_EMAIL_VERIFICATION and not email_is_verified(user.id, db):
        raise HTTPException(status_code=403, detail="Verify your email before signing in.")
    session.revoked_at = now
    db.flush()
    return issue_tokens(user, db)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: RefreshRequest, db: Session = Depends(get_db)):
    session = db.query(models.AuthSession).filter_by(
        refresh_token_hash=auth.hash_refresh_token(request.refresh_token)
    ).first()
    if session is not None and session.revoked_at is None:
        session.revoked_at = datetime.now(timezone.utc)
        db.commit()
    return None


@router.get("/me", response_model=UserResponse)
def me(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.get(models.UserProfile, current_user.id)
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        created_at=current_user.created_at,
        first_name=profile.first_name if profile else "",
        last_name=profile.last_name if profile else "",
    )


@router.put("/me", response_model=UserResponse)
def update_me(
    body: NameUpdateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.get(models.UserProfile, current_user.id)
    if profile is None:
        profile = models.UserProfile(user_id=current_user.id, first_name=body.first_name, last_name=body.last_name)
        db.add(profile)
    else:
        profile.first_name = body.first_name
        profile.last_name = body.last_name
    db.commit()
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        created_at=current_user.created_at,
        first_name=profile.first_name,
        last_name=profile.last_name,
    )


@router.post("/verify-email/request", status_code=status.HTTP_202_ACCEPTED)
@limiter.limit("3/hour")
def request_email_verification(request: Request, body: EmailRequest, db: Session = Depends(get_db)):
    if not auth_email_is_configured():
        raise HTTPException(status_code=503, detail="Email delivery is not configured on this server.")
    user = db.query(models.User).filter_by(email=body.email).first()
    if user is not None and not email_is_verified(user.id, db):
        try:
            token = issue_action_token(user, "verify_email", db)
            send_verification_email(user.email, token)
            db.commit()
        except Exception:
            db.rollback()
            logger.exception("Failed to send an email verification message.")
    return {"message": "If the account needs verification, an email has been sent."}


@router.post("/verify-email/confirm")
@limiter.limit("10/minute")
def confirm_email_verification(request: Request, body: ActionTokenRequest, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    action = db.query(models.AuthActionToken).filter_by(
        token_hash=auth.hash_action_token(body.token),
        purpose="verify_email",
    ).with_for_update().first()
    if action is None or action.consumed_at is not None:
        raise HTTPException(status_code=400, detail="Invalid or already used verification token.")
    expires_at = action.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= now:
        action.consumed_at = now
        db.commit()
        raise HTTPException(status_code=400, detail="Verification token has expired.")
    action.consumed_at = now
    verification = db.get(models.UserEmailVerification, action.user_id)
    if verification is None:
        db.add(models.UserEmailVerification(user_id=action.user_id, verified_at=now))
    else:
        verification.verified_at = now
    db.query(models.AuthActionToken).filter(
        models.AuthActionToken.user_id == action.user_id,
        models.AuthActionToken.purpose == "verify_email",
        models.AuthActionToken.consumed_at.is_(None),
    ).update({"consumed_at": now}, synchronize_session=False)
    db.commit()
    return {"message": "Email verified successfully. You can now sign in."}


@router.post("/password/forgot", status_code=status.HTTP_202_ACCEPTED)
@limiter.limit("3/hour")
def request_password_reset(request: Request, body: EmailRequest, db: Session = Depends(get_db)):
    if not auth_email_is_configured():
        raise HTTPException(status_code=503, detail="Email delivery is not configured on this server.")
    user = db.query(models.User).filter_by(email=body.email).first()
    if user is not None:
        try:
            token = issue_action_token(user, "password_reset", db)
            send_password_reset_email(user.email, token)
            db.commit()
        except Exception:
            db.rollback()
            logger.exception("Failed to send a password reset message.")
            # Keep the response identical for known and unknown accounts.
    return {"message": "If an account exists for that email, password reset instructions have been sent."}


@router.post("/password/reset")
@limiter.limit("10/minute")
def reset_password(request: Request, body: PasswordResetRequest, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    action = db.query(models.AuthActionToken).filter_by(
        token_hash=auth.hash_action_token(body.token),
        purpose="password_reset",
    ).with_for_update().first()
    if action is None or action.consumed_at is not None:
        raise HTTPException(status_code=400, detail="Invalid or already used password reset token.")
    expires_at = action.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= now:
        action.consumed_at = now
        db.commit()
        raise HTTPException(status_code=400, detail="Password reset token has expired.")

    user = db.get(models.User, action.user_id)
    if user is None:
        raise HTTPException(status_code=400, detail="Invalid password reset token.")
    user.password_hash = auth.hash_password(body.new_password)
    action.consumed_at = now
    db.query(models.AuthActionToken).filter(
        models.AuthActionToken.user_id == user.id,
        models.AuthActionToken.purpose == "password_reset",
        models.AuthActionToken.consumed_at.is_(None),
    ).update({"consumed_at": now}, synchronize_session=False)
    db.query(models.AuthSession).filter_by(user_id=user.id).filter(
        models.AuthSession.revoked_at.is_(None)
    ).update({"revoked_at": now}, synchronize_session=False)
    db.commit()
    return {"message": "Password reset successfully. Sign in with your new password."}
