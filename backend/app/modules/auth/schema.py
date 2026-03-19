from pydantic import BaseModel, EmailStr, Field

from app.modules.users.schema import UserRead, UserRoleRead


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRoleRead


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
