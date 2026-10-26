
from sqlalchemy import Integer, String
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
