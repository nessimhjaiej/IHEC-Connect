import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.users.model import User
from app.modules.users.schema import UserAdminUpdate, UserUpdate


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, user_id: uuid.UUID | str) -> User | None:
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def list_users(
        self,
        can_tutor: bool | None = None,
        is_alumni: bool | None = None,
        is_admin: bool | None = None,
    ) -> list[User]:
        query = select(User).order_by(User.created_at.desc())
        if can_tutor is not None:
            query = query.where(User.can_tutor == can_tutor)
        if is_alumni is not None:
            query = query.where(User.is_alumni == is_alumni)
        if is_admin is not None:
            query = query.where(User.is_admin == is_admin)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def list_tutors(self) -> list[User]:
        result = await self.session.execute(
            select(User).where(User.is_verified_tutor == True, User.is_active == True)
        )
        return list(result.scalars().all())

    async def update(self, user: User, payload: UserUpdate) -> User:
        updates = payload.model_dump(exclude_unset=True)
        for field, value in updates.items():
            setattr(user, field, value)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def admin_update(self, user: User, payload: UserAdminUpdate) -> User:
        updates = payload.model_dump(exclude_unset=True)
        for field, value in updates.items():
            setattr(user, field, value)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def create(self, user: User) -> User:
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def upsert(self, user: User) -> User:
        existing = await self.get_by_id(user.id)
        if existing is None:
            self.session.add(user)
            await self.session.commit()
            await self.session.refresh(user)
            return user

        existing.full_name = user.full_name
        existing.email = user.email
        if user.bio is not None:
            existing.bio = user.bio
        if user.major_id is not None:
            existing.major_id = user.major_id
        if user.academic_year_id is not None:
            existing.academic_year_id = user.academic_year_id
        if user.avatar_url is not None:
            existing.avatar_url = user.avatar_url
        existing.can_tutor = user.can_tutor
        existing.is_verified_tutor = user.is_verified_tutor
        existing.is_alumni = user.is_alumni
        existing.is_admin = user.is_admin
        existing.is_active = user.is_active
        await self.session.commit()
        await self.session.refresh(existing)
        return existing
