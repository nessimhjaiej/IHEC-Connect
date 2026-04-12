import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserRole(str, enum.Enum):
    student = "student"
    tutor = "tutor"
    admin = "admin"


class User(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    bio: Mapped[str | None] = mapped_column(String(500), nullable=True)
    major_id: Mapped[int | None] = mapped_column(ForeignKey("majors.id"), nullable=True, index=True)
    academic_year_id: Mapped[int | None] = mapped_column(
        ForeignKey("academic_years.id"), nullable=True, index=True
    )
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    sessions = relationship("Session", back_populates="tutor")
    joined_sessions = relationship("SessionParticipant", back_populates="user")
    reviews_received = relationship("Review", foreign_keys="Review.reviewee_id", back_populates="reviewee")
    reviews_written = relationship("Review", foreign_keys="Review.reviewer_id", back_populates="reviewer")
    documents = relationship("Document", back_populates="uploader")
    event_participations = relationship("EventParticipant", back_populates="user")
    hosted_events = relationship("Event", back_populates="host_user")
    major = relationship("Major", back_populates="profiles")
    academic_year = relationship("AcademicYear", back_populates="profiles")
