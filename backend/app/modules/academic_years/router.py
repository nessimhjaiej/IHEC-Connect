from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import require_role
from app.modules.academic_years.repository import AcademicYearRepository
from app.modules.academic_years.schema import AcademicYearCreate, AcademicYearRead
from app.modules.academic_years.service import AcademicYearService
from app.modules.users.model import UserRole

router = APIRouter(prefix="/academic-years", tags=["academic-years"])


def get_academic_year_service(session: AsyncSession = Depends(get_db_session)) -> AcademicYearService:
    return AcademicYearService(AcademicYearRepository(session))


@router.get("", response_model=list[AcademicYearRead])
async def list_academic_years(
    service: AcademicYearService = Depends(get_academic_year_service),
) -> list[AcademicYearRead]:
    return await service.list_academic_years()


@router.post("", response_model=AcademicYearRead, status_code=201)
async def create_academic_year(
    payload: AcademicYearCreate,
    service: AcademicYearService = Depends(get_academic_year_service),
    _: object = Depends(require_role(UserRole.admin)),
) -> AcademicYearRead:
    return await service.create_academic_year(payload)
