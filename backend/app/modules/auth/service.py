from fastapi import HTTPException, status

from app.core.security import create_access_token, get_password_hash, verify_password
from app.modules.auth.repository import AuthRepository
from app.modules.auth.schema import LoginRequest, RegisterRequest, TokenResponse
from app.modules.users.model import User
from app.modules.users.schema import UserRead


class AuthService:
    def __init__(self, repository: AuthRepository) -> None:
        self.repository = repository

    async def login(self, payload: LoginRequest) -> TokenResponse:
        user = await self.repository.get_user_by_email(payload.email)
        if user is None or not verify_password(payload.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        return TokenResponse(
            access_token=create_access_token(str(user.id)),
            user=UserRead.model_validate(user),
        )

    async def register(self, payload: RegisterRequest) -> TokenResponse:
        existing_user = await self.repository.get_user_by_email(payload.email)
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered.",
            )

        user = User(
            full_name=payload.full_name,
            email=payload.email,
            password_hash=get_password_hash(payload.password),
            role=payload.role.value,
        )
        created_user = await self.repository.create_user(user)
        return TokenResponse(
            access_token=create_access_token(str(created_user.id)),
            user=UserRead.model_validate(created_user),
        )
