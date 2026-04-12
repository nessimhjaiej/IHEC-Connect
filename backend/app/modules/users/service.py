import uuid
from fastapi import HTTPException, status

from app.modules.users.model import User, UserRole
from app.modules.users.repository import UserRepository
from app.modules.users.schema import UserAdminUpdate, UserRead, UserUpdate


class UserService:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    async def get_profile(self, user_id: uuid.UUID | str) -> UserRead:
        user = await self.repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        return UserRead.model_validate(user)

    async def list_users(self, role: UserRole | None = None) -> list[UserRead]:
        users = await self.repository.list_users(role=role)
        return [UserRead.model_validate(u) for u in users]

    async def list_tutors(self) -> list[UserRead]:
        tutors = await self.repository.list_tutors()
        return [UserRead.model_validate(t) for t in tutors]

    async def update_profile(self, current_user: User, payload: UserUpdate) -> UserRead:
        updated = await self.repository.update(current_user, payload)
        return UserRead.model_validate(updated)

    async def admin_update_user(self, user_id: uuid.UUID | str, payload: UserAdminUpdate) -> UserRead:
        user = await self.repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        updated = await self.repository.admin_update(user, payload)
        return UserRead.model_validate(updated)
