import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRoleRead(str, Enum):
    student = "student"
    tutor = "tutor"
    admin = "admin"


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
    role: UserRoleRead
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
    role: UserRoleRead | None = None
