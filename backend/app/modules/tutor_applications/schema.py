import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.modules.tutor_applications.model import TutorApplicationStatus


class TutorApplicationCreate(BaseModel):
    subject_id: int
    grade: float = Field(ge=0, le=20)
    professor_id: uuid.UUID | None = None


class TutorApplicationStatusUpdate(BaseModel):
    status: TutorApplicationStatus


class TutorApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: uuid.UUID
    subject_id: int
    grade: float
    status: TutorApplicationStatus
    professor_id: uuid.UUID | None
    created_at: datetime
