<<<<<<< HEAD
from pydantic import BaseModel
from typing import Optional

class ReviewCreate(BaseModel):
    session_id: int
    rating: int
    comment: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    user_id: int
    session_id: int
    rating: int
    comment: Optional[str] = None
    class Config:
        from_attributes = True
=======
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
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
