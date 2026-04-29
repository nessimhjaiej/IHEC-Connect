<<<<<<< HEAD
from sqlalchemy.orm import Session
from app.modules.users.model import User


def get_all(db: Session):
    return db.query(User).all()


def get_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def update(db: Session, user_id: int, data: dict):
    user = get_by_id(db, user_id)
    if user:
        for k, v in data.items():
            setattr(user, k, v)
        db.commit()
        db.refresh(user)
    return user
=======
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.users.model import AdminProfile, StudentProfile, User
from app.modules.users.schema import UserAdminUpdate, UserUpdate


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, user_id: uuid.UUID | str) -> User | None:
        result = await self.session.execute(
            select(User)
            .options(selectinload(User.student_profile), selectinload(User.admin_profile))
            .where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(
            select(User)
            .options(selectinload(User.student_profile), selectinload(User.admin_profile))
            .where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def list_users(
        self,
        is_tutor: bool | None = None,
        is_alumni: bool | None = None,
        is_admin: bool | None = None,
    ) -> list[User]:
        query = (
            select(User)
            .options(selectinload(User.student_profile), selectinload(User.admin_profile))
            .order_by(User.created_at.desc())
        )
        if is_tutor is not None or is_alumni is not None:
            query = query.outerjoin(StudentProfile, StudentProfile.id == User.id)
        if is_tutor is not None:
            query = query.where(StudentProfile.is_tutor == is_tutor)
        if is_alumni is not None:
            query = query.where(StudentProfile.is_alumni == is_alumni)
        if is_admin is not None:
            query = query.outerjoin(AdminProfile, AdminProfile.id == User.id)
            if is_admin:
                query = query.where(AdminProfile.id.is_not(None))
            else:
                query = query.where(AdminProfile.id.is_(None))
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def list_tutors(self) -> list[User]:
        result = await self.session.execute(
            select(User)
            .join(StudentProfile, StudentProfile.id == User.id)
            .options(selectinload(User.student_profile), selectinload(User.admin_profile))
            .where(StudentProfile.is_tutor == True, User.is_active == True)
        )
        return list(result.scalars().all())

    async def update(self, user: User, payload: UserUpdate) -> User:
        updates = payload.model_dump(exclude_unset=True)
        if "full_name" in updates:
            user.full_name = updates["full_name"]
        if "bio" in updates:
            user.bio = updates["bio"]
        if "avatar_url" in updates:
            user.avatar_url = updates["avatar_url"]
        if "major_id" in updates or "academic_year_id" in updates:
            student = user.student_profile or StudentProfile(id=user.id)
            if "major_id" in updates:
                student.major_id = updates["major_id"]
            if "academic_year_id" in updates:
                student.academic_year_id = updates["academic_year_id"]
            user.student_profile = student
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def admin_update(self, user: User, payload: UserAdminUpdate) -> User:
        updates = payload.model_dump(exclude_unset=True)
        if "is_active" in updates:
            user.is_active = updates["is_active"]
        if any(field in updates for field in ("is_tutor", "is_alumni")):
            student = user.student_profile or StudentProfile(id=user.id)
            if "is_tutor" in updates:
                student.is_tutor = updates["is_tutor"]
            if "is_alumni" in updates:
                student.is_alumni = updates["is_alumni"]
            user.student_profile = student
        if "is_admin" in updates:
            if updates["is_admin"] and user.admin_profile is None:
                user.admin_profile = AdminProfile(id=user.id)
            if not updates["is_admin"] and user.admin_profile is not None:
                await self.session.delete(user.admin_profile)
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
        if user.avatar_url is not None:
            existing.avatar_url = user.avatar_url
        existing.is_active = user.is_active
        if user.student_profile is not None:
            if existing.student_profile is None:
                existing.student_profile = StudentProfile(id=existing.id)
            existing.student_profile.major_id = user.student_profile.major_id
            existing.student_profile.academic_year_id = user.student_profile.academic_year_id
            existing.student_profile.is_tutor = user.student_profile.is_tutor
            existing.student_profile.is_alumni = user.student_profile.is_alumni
        if user.admin_profile is not None and existing.admin_profile is None:
            existing.admin_profile = AdminProfile(id=existing.id)
        await self.session.commit()
        await self.session.refresh(existing)
        return existing
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
