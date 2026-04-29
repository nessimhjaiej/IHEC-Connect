from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.majors.model import Major


class MajorRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_majors(self) -> list[Major]:
        result = await self.session.execute(select(Major).order_by(Major.name.asc()))
        return list(result.scalars().all())

    async def get_by_code(self, code: str) -> Major | None:
        result = await self.session.execute(select(Major).where(Major.code == code))
        return result.scalar_one_or_none()

    async def create(self, major: Major) -> Major:
        self.session.add(major)
        await self.session.commit()
        await self.session.refresh(major)
        return major
