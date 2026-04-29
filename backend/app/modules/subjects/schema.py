<<<<<<< HEAD
from pydantic import BaseModel

class SubjectOut(BaseModel):
    id: int
    name: str
    code: str
    class Config:
        from_attributes = True
=======
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
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
