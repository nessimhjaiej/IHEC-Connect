from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.users.model import User
from app.modules.users.repository import UserRepository


class AuthRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.users = UserRepository(session)

    async def get_user_profile(self, user_id: str) -> User | None:
        return await self.users.get_by_id(user_id)
