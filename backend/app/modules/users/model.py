<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id                = Column(Integer, primary_key=True, index=True)
    name              = Column(String(100), nullable=False)
    email             = Column(String(200), unique=True, index=True, nullable=False)
    hashed_password   = Column(String(200), nullable=False)
    role              = Column(String(50), default="student")          # student | admin
    tutor_status      = Column(String(50), default="none")             # none | pending | approved | rejected
    level             = Column(String(50), nullable=True)
    subject           = Column(String(100), nullable=True)
    bio               = Column(String(500), nullable=True)
    email_verified    = Column(Boolean, default=False)
    accepted_terms    = Column(Boolean, default=False)
    verify_code       = Column(String(10), nullable=True)              # code de vérification email
    verify_code_exp   = Column(DateTime(timezone=True), nullable=True) # expiration du code
    reset_token       = Column(String(200), nullable=True)             # token reset mot de passe
    reset_token_exp   = Column(DateTime(timezone=True), nullable=True) # expiration reset
    created_at        = Column(DateTime(timezone=True), server_default=func.now())
=======
import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, func
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
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    student_profile = relationship(
        "StudentProfile",
        uselist=False,
        back_populates="profile",
        cascade="all, delete-orphan",
    )
    admin_profile = relationship(
        "AdminProfile",
        uselist=False,
        back_populates="profile",
        cascade="all, delete-orphan",
    )
    sessions = relationship("Session", back_populates="tutor")
    joined_sessions = relationship("SessionParticipant", back_populates="user")
    reviews_received = relationship("Review", foreign_keys="Review.reviewee_id", back_populates="reviewee")
    reviews_written = relationship("Review", foreign_keys="Review.reviewer_id", back_populates="reviewer")
    documents = relationship("Document", back_populates="uploader")
    event_participations = relationship("EventParticipant", back_populates="user")
    hosted_events = relationship("Event", back_populates="host_user")
    tutor_applications = relationship(
        "TutorApplication",
        foreign_keys="TutorApplication.user_id",
        back_populates="user",
    )
    reviewed_tutor_applications = relationship(
        "TutorApplication",
        foreign_keys="TutorApplication.professor_id",
        back_populates="professor",
    )
    uploaded_recordings = relationship("Recording", back_populates="uploader")

    @property
    def major_id(self) -> int | None:
        return self.student_profile.major_id if self.student_profile else None

    @property
    def academic_year_id(self) -> int | None:
        return self.student_profile.academic_year_id if self.student_profile else None

    @property
    def is_tutor(self) -> bool:
        return bool(self.student_profile and self.student_profile.is_tutor)

    @property
    def can_tutor(self) -> bool:
        return self.is_tutor

    @property
    def is_alumni(self) -> bool:
        return bool(self.student_profile and self.student_profile.is_alumni)

    @property
    def is_admin(self) -> bool:
        return self.admin_profile is not None

    @property
    def role(self) -> UserRole:
        if self.is_admin:
            return UserRole.admin
        if self.is_tutor:
            return UserRole.tutor
        return UserRole.student


class StudentProfile(Base):
    __tablename__ = "students"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id"), primary_key=True
    )
    major_id: Mapped[int | None] = mapped_column(ForeignKey("majors.id"), nullable=True, index=True)
    academic_year_id: Mapped[int | None] = mapped_column(
        ForeignKey("academic_years.id"), nullable=True, index=True
    )
    is_tutor: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    is_alumni: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    profile = relationship("User", back_populates="student_profile")
    major = relationship("Major", back_populates="students")
    academic_year = relationship("AcademicYear", back_populates="students")


class AdminProfile(Base):
    __tablename__ = "admins"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id"), primary_key=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("User", back_populates="admin_profile")
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
