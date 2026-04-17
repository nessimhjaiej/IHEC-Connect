import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    bio: str | None = Field(default=None, max_length=500)
    major_id: int | None = None
    academic_year_id: int | None = None
    avatar_url: str | None = None


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    is_tutor: bool
    is_alumni: bool
    is_admin: bool
    is_active: bool
    created_at: datetime


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    bio: str | None = Field(default=None, max_length=500)
    major_id: int | None = None
    academic_year_id: int | None = None
    avatar_url: str | None = None


class UserAdminUpdate(BaseModel):
    is_active: bool | None = None
    is_tutor: bool | None = None
    is_alumni: bool | None = None
    is_admin: bool | None = None
