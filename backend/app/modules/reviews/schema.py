import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    session_id: int
    reviewee_id: uuid.UUID
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewRead(ReviewCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reviewer_id: uuid.UUID
    created_at: datetime
