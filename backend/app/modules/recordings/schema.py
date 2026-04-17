import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RecordingCreate(BaseModel):
    event_id: int
    youtube_url: str = Field(min_length=10, max_length=500)


class RecordingValidationUpdate(BaseModel):
    validated: bool


class RecordingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_id: int
    youtube_url: str
    uploaded_by: uuid.UUID
    validated: bool
    created_at: datetime
