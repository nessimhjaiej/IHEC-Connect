import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.modules.subjects.schema import SubjectRead
from app.modules.users.schema import UserRead


class SessionCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str | None = None
    scheduled_at: datetime
    duration_minutes: int = Field(default=60, ge=30, le=240)
    capacity: int = Field(default=20, ge=1, le=500)
    subject_id: int
    meet_link: str | None = None


class SessionUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    description: str | None = None
    scheduled_at: datetime | None = None
    duration_minutes: int | None = Field(default=None, ge=30, le=240)
    capacity: int | None = Field(default=None, ge=1, le=500)
    meet_link: str | None = None
    is_cancelled: bool | None = None


class SessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str | None
    scheduled_at: datetime
    duration_minutes: int
    capacity: int
    meet_link: str | None
    is_cancelled: bool
    tutor_id: uuid.UUID
    subject_id: int
    created_at: datetime


class SessionDetail(SessionRead):
    tutor: UserRead
    subject: SubjectRead
    participant_count: int = 0
    average_rating: float | None = None
