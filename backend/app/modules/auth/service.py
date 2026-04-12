from fastapi import HTTPException, status

from app.modules.auth.repository import AuthRepository
from app.modules.auth.schema import SessionResponse
from app.modules.users.schema import UserRead


class AuthService:
    def __init__(self, repository: AuthRepository) -> None:
        self.repository = repository

    async def get_session(self, user_id: str) -> SessionResponse:
        user = await self.repository.get_user_profile(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authenticated user profile not found.",
            )
        return SessionResponse(user=UserRead.model_validate(user))
