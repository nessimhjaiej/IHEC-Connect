from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.academic_years.model import AcademicYear


class AcademicYearRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_academic_years(self) -> list[AcademicYear]:
        result = await self.session.execute(
            select(AcademicYear).order_by(AcademicYear.sort_order.asc(), AcademicYear.id.asc())
        )
        return list(result.scalars().all())

    async def create(self, year: AcademicYear) -> AcademicYear:
        self.session.add(year)
        await self.session.commit()
        await self.session.refresh(year)
        return year
