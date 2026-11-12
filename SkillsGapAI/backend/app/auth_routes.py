"""Registration, login, refresh, logout, and identity endpoints."""

import re
from datetime import datetime, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy.orm import Session

from backend.app import auth, models
from backend.app.database import SessionLocal


router = APIRouter(prefix="/api/auth", tags=["authentication"])
bearer_scheme = HTTPBearer(auto_error=False)
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


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


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=32, max_length=256)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    created_at: datetime


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
    db.add(
        models.AuthSession(
            user_id=user.id,
            refresh_token_hash=auth.hash_refresh_token(refresh_token),
            expires_at=auth.refresh_token_expiry(),
        )
    )
    db.commit()
    return TokenResponse(
        access_token=auth.create_access_token(user.id),
        refresh_token=refresh_token,
        user=user,
    )


def get_current_user(
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
        user_id = auth.decode_access_token(credentials.credentials)
    except jwt.InvalidTokenError:
        raise unauthorized
    user = db.get(models.User, user_id)
    if user is None:
        raise unauthorized
    return user


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(credentials: Credentials, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter_by(email=credentials.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    user = models.User(
        email=credentials.email,
        password_hash=auth.hash_password(credentials.password),
    )
    db.add(user)
    try:
        db.flush()
        response = issue_tokens(user, db)
    except Exception:
        db.rollback()
        # A concurrent registration can win after the initial lookup.
        if db.query(models.User).filter_by(email=credentials.email).first():
            raise HTTPException(status_code=409, detail="An account with this email already exists")
        raise
    return response


@router.post("/login", response_model=TokenResponse)
def login(credentials: Credentials, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=credentials.email).first()
    if user is None or not auth.verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return issue_tokens(user, db)


@router.post("/refresh", response_model=TokenResponse)
def refresh_tokens(request: RefreshRequest, db: Session = Depends(get_db)):
    token_hash = auth.hash_refresh_token(request.refresh_token)
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
def me(current_user: models.User = Depends(get_current_user)):
    return current_user
