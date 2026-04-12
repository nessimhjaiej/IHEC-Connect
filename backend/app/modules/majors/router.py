from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import require_role
from app.modules.majors.repository import MajorRepository
from app.modules.majors.schema import MajorCreate, MajorRead
from app.modules.majors.service import MajorService
from app.modules.users.model import UserRole

router = APIRouter(prefix="/majors", tags=["majors"])


def get_major_service(session: AsyncSession = Depends(get_db_session)) -> MajorService:
    return MajorService(MajorRepository(session))


@router.get("", response_model=list[MajorRead])
async def list_majors(service: MajorService = Depends(get_major_service)) -> list[MajorRead]:
    return await service.list_majors()


@router.post("", response_model=MajorRead, status_code=201)
async def create_major(
    payload: MajorCreate,
    service: MajorService = Depends(get_major_service),
    _: object = Depends(require_role(UserRole.admin)),
) -> MajorRead:
    return await service.create_major(payload)
