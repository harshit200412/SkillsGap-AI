
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class JobRole(Base):
    __tablename__ = "job_roles"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    key: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False
    )
    name: Mapped[str] = mapped_column(
        String(150), nullable=False
    )
    track: Mapped[str] = mapped_column(
        String(100), nullable=False
    )
    level: Mapped[str] = mapped_column(
        String(100), nullable=False
    )
    blurb: Mapped[str] = mapped_column(
        String(300), nullable=False
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(512), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    refresh_token_hash: Mapped[str] = mapped_column(
        String(64), unique=True, index=True, nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
