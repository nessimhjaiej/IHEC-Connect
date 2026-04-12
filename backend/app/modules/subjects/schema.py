from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SubjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    major_id: int | None = None
    academic_year_id: int | None = None


class SubjectRead(SubjectCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
