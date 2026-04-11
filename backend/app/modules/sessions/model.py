import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class SessionType(str, enum.Enum):
    tutoring = "tutoring"
    entrepreneurship = "entrepreneurship"


class DeliveryMode(str, enum.Enum):
    online = "online"
    in_person = "in_person"


class PricingType(str, enum.Enum):
    free = "free"
    paid = "paid"


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    session_type: Mapped[SessionType] = mapped_column(
        Enum(SessionType),
        nullable=False,
        default=SessionType.tutoring,
    )
    delivery_mode: Mapped[DeliveryMode] = mapped_column(
        Enum(DeliveryMode),
        nullable=False,
        default=DeliveryMode.online,
    )
    pricing_type: Mapped[PricingType] = mapped_column(
        Enum(PricingType),
        nullable=False,
        default=PricingType.free,
    )
    price_dt: Mapped[float | None] = mapped_column(Numeric(6, 2), nullable=True)
    location_text: Mapped[str | None] = mapped_column(String(255), nullable=True)
    meeting_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    major: Mapped[str | None] = mapped_column(String(120), nullable=True)
    academic_year: Mapped[str | None] = mapped_column(String(50), nullable=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
    capacity: Mapped[int] = mapped_column(Integer, default=20)
    tutor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    subject_id: Mapped[int | None] = mapped_column(ForeignKey("subjects.id"), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    tutor = relationship("User", back_populates="sessions")
    subject = relationship("Subject", back_populates="sessions")
    participants = relationship("SessionParticipant", back_populates="session")
    reviews = relationship("Review", back_populates="session")
