from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    session_id: int
    reviewee_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewRead(ReviewCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reviewer_id: int
    created_at: datetime
