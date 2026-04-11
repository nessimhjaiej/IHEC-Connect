import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.modules.subjects.schema import SubjectRead
from app.modules.users.schema import UserRead


class SessionCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str | None = None
    session_type: Literal["tutoring", "entrepreneurship"] = "tutoring"
    delivery_mode: Literal["online", "in_person"] = "online"
    pricing_type: Literal["free", "paid"] = "free"
    price_dt: float | None = Field(default=None, ge=0, le=10)
    location_text: str | None = Field(default=None, max_length=255)
    meeting_url: str | None = Field(default=None, max_length=500)
    major: str | None = Field(default=None, max_length=120)
    academic_year: str | None = Field(default=None, max_length=50)
    scheduled_at: datetime
    duration_minutes: int = Field(default=60, ge=30, le=240)
    capacity: int = Field(default=20, ge=1, le=500)
    subject_id: int | None = None

    @model_validator(mode="after")
    def validate_payload(self) -> "SessionCreate":
        if self.session_type == "tutoring" and self.subject_id is None:
            raise ValueError("Tutoring sessions require a subject.")
        if self.pricing_type == "paid" and self.price_dt is None:
            raise ValueError("Paid sessions require a price.")
        if self.pricing_type == "paid" and self.price_dt is not None and not 5 <= self.price_dt <= 10:
            raise ValueError("Paid sessions must be priced between 5 and 10 DT.")
        if self.delivery_mode == "online" and not self.meeting_url:
            raise ValueError("Online sessions require a meeting URL.")
        if self.delivery_mode == "in_person" and not self.location_text:
            raise ValueError("In-person sessions require a location.")
        return self


class SessionRead(SessionCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tutor_id: uuid.UUID
    created_at: datetime


class SessionDetail(SessionRead):
    tutor: UserRead
    subject: SubjectRead | None = None
    participant_count: int = 0
