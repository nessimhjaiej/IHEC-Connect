from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.subjects.model import Subject


class SubjectRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_subjects(self) -> list[Subject]:
        result = await self.session.execute(select(Subject).order_by(Subject.name.asc()))
        return list(result.scalars().all())

    async def get_by_name(self, name: str) -> Subject | None:
        result = await self.session.execute(select(Subject).where(Subject.name == name))
        return result.scalar_one_or_none()

    async def get_by_id(self, subject_id: int) -> Subject | None:
        result = await self.session.execute(select(Subject).where(Subject.id == subject_id))
        return result.scalar_one_or_none()

    async def create(self, subject: Subject) -> Subject:
        self.session.add(subject)
        await self.session.commit()
        await self.session.refresh(subject)
        return subject
