import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.modules.events.model import DeliveryMode, EventType


class EventCreate(BaseModel):
    type: EventType = EventType.academic
    title: str = Field(min_length=3, max_length=200)
    description: str | None = None
    subject_id: int | None = None
    major_id: int | None = None
    academic_year_id: int | None = None
    delivery_mode: DeliveryMode = DeliveryMode.onsite
    location_text: str | None = Field(default=None, max_length=300)
    meeting_url: str | None = Field(default=None, max_length=500)
    starts_at: datetime
    ends_at: datetime | None = None
    capacity: int = Field(default=50, ge=1, le=5000)


class EventUpdate(BaseModel):
    type: EventType | None = None
    title: str | None = Field(default=None, min_length=3, max_length=200)
    description: str | None = None
    subject_id: int | None = None
    major_id: int | None = None
    academic_year_id: int | None = None
    delivery_mode: DeliveryMode | None = None
    location_text: str | None = None
    meeting_url: str | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    capacity: int | None = Field(default=None, ge=1, le=5000)


class EventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    type: EventType
    title: str
    description: str | None
    host_user_id: uuid.UUID
    subject_id: int | None
    major_id: int | None
    academic_year_id: int | None
    delivery_mode: DeliveryMode
    location_text: str | None
    meeting_url: str | None
    starts_at: datetime
    ends_at: datetime | None
    capacity: int
    created_at: datetime
    participant_count: int = 0


class EventParticipantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    event_id: int
    user_id: uuid.UUID
    status: str
    joined_at: datetime


# Backward-compatible alias used by existing imports.
EventRegistrationRead = EventParticipantRead
