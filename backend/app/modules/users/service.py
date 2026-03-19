from fastapi import HTTPException, status

from app.modules.users.model import User
from app.modules.users.repository import UserRepository
from app.modules.users.schema import UserRead, UserUpdate


class UserService:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    async def get_profile(self, user_id: int) -> UserRead:
        user = await self.repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        return UserRead.model_validate(user)

    async def list_users(self) -> list[UserRead]:
        users = await self.repository.list_users()
        return [UserRead.model_validate(user) for user in users]

    async def update_profile(self, current_user: User, payload: UserUpdate) -> UserRead:
        updated_user = await self.repository.update(current_user, payload)
        return UserRead.model_validate(updated_user)
