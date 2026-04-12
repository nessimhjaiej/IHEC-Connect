import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    event_id: int
    reviewee_id: uuid.UUID
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    event_id: int
    reviewer_id: uuid.UUID
    reviewee_id: uuid.UUID
    rating: int
    comment: str | None
    created_at: datetime


class TutorRatingSummary(BaseModel):
    tutor_id: uuid.UUID
    average_rating: float | None
    review_count: int
