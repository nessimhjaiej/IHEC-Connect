import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class TutorApplicationStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class TutorApplication(Base):
    __tablename__ = "tutor_applications"
    __table_args__ = (UniqueConstraint("user_id", "subject_id", name="uq_tutor_application_user_subject"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False, index=True
    )
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False, index=True)
    grade: Mapped[float] = mapped_column(Numeric(4, 2), nullable=False)
    status: Mapped[TutorApplicationStatus] = mapped_column(
        Enum(TutorApplicationStatus, name="tutor_application_status"),
        nullable=False,
        default=TutorApplicationStatus.pending,
    )
    professor_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", foreign_keys=[user_id], back_populates="tutor_applications")
    professor = relationship(
        "User",
        foreign_keys=[professor_id],
        back_populates="reviewed_tutor_applications",
    )
    subject = relationship("Subject")
