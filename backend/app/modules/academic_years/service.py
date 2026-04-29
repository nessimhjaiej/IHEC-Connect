from app.modules.academic_years.model import AcademicYear
from app.modules.academic_years.repository import AcademicYearRepository
from app.modules.academic_years.schema import AcademicYearCreate, AcademicYearRead


class AcademicYearService:
    def __init__(self, repository: AcademicYearRepository) -> None:
        self.repository = repository

    async def list_academic_years(self) -> list[AcademicYearRead]:
        years = await self.repository.list_academic_years()
        return [AcademicYearRead.model_validate(year) for year in years]

    async def create_academic_year(self, payload: AcademicYearCreate) -> AcademicYearRead:
        year = AcademicYear(**payload.model_dump())
        created = await self.repository.create(year)
        return AcademicYearRead.model_validate(created)
