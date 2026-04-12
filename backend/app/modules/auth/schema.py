import uuid

from pydantic import BaseModel, EmailStr, Field

from app.modules.users.schema import UserRead


class SessionResponse(BaseModel):
    user: UserRead


class RegisterProfileRequest(BaseModel):
    id: uuid.UUID
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    role: str = Field(pattern="^(student|tutor|admin)$")
    major_id: int | None = None
    academic_year_id: int | None = None
