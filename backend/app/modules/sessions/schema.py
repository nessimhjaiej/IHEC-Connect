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


class SessionRead(SessionCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tutor_id: uuid.UUID
    created_at: datetime


class SessionDetail(SessionRead):
    tutor: UserRead
    subject: SubjectRead
    participant_count: int = 0
