<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
=======
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
from app.core.database import Base


class Session(Base):
    __tablename__ = "sessions"

<<<<<<< HEAD
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    subject = Column(String(100), nullable=True)
    instructor = Column(String(100), nullable=True)
    duration = Column(Integer, default=60)
    max_participants = Column(Integer, default=20)
    date = Column(String(20), nullable=True)
    status = Column(String(20), default="upcoming")
    color = Column(String(20), default="#b8d4f0")
    icon = Column(String(30), default="book")
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
=======
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
    capacity: Mapped[int] = mapped_column(Integer, default=20)
    meet_link: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_cancelled: Mapped[bool] = mapped_column(Boolean, default=False)

    tutor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False, index=True
    )
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    tutor = relationship("User", back_populates="sessions")
    subject = relationship("Subject", back_populates="sessions")
    participants = relationship("SessionParticipant", back_populates="session", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="session", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="session")
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
