<<<<<<< HEAD
from sqlalchemy.orm import Session
from app.modules.users import repository


def get_all_users(db: Session):
    return repository.get_all(db)


def get_user(db: Session, user_id: int):
    return repository.get_by_id(db, user_id)


def update_user(db: Session, user_id: int, data: dict):
    return repository.update(db, user_id, data)
=======
import uuid
from fastapi import HTTPException, status

from app.modules.users.model import User
from app.modules.users.repository import UserRepository
from app.modules.users.schema import UserAdminUpdate, UserRead, UserUpdate


class UserService:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    async def get_profile(self, user_id: uuid.UUID | str, current_user: User) -> UserRead:
        if not current_user.is_admin and str(current_user.id) != str(user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User profile access denied.")
        user = await self.repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        return UserRead.model_validate(user)

    async def list_users(
        self,
        is_tutor: bool | None = None,
        is_alumni: bool | None = None,
        is_admin: bool | None = None,
    ) -> list[UserRead]:
        users = await self.repository.list_users(
            is_tutor=is_tutor,
            is_alumni=is_alumni,
            is_admin=is_admin,
        )
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
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
