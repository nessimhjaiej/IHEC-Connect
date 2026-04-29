import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.tutor_applications.model import TutorApplication


class TutorApplicationRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_for_user(self, user_id: uuid.UUID) -> list[TutorApplication]:
        result = await self.session.execute(
            select(TutorApplication)
            .where(TutorApplication.user_id == user_id)
            .order_by(TutorApplication.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, application_id: int) -> TutorApplication | None:
        result = await self.session.execute(
            select(TutorApplication)
            .options(selectinload(TutorApplication.user))
            .where(TutorApplication.id == application_id)
        )
        return result.scalar_one_or_none()

    async def create(self, application: TutorApplication) -> TutorApplication:
        self.session.add(application)
        await self.session.commit()
        await self.session.refresh(application)
        return application

    async def save(self, application: TutorApplication) -> TutorApplication:
        await self.session.commit()
        await self.session.refresh(application)
        return application
