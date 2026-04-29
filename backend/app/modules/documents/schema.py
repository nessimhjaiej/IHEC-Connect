import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class DocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    file_name: str
    file_size: int
    mime_type: str
    uploader_id: uuid.UUID
    session_id: int | None
    created_at: datetime


class DocumentCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    session_id: int | None = None
