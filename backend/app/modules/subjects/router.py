from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import require_role
from app.modules.subjects.repository import SubjectRepository
from app.modules.subjects.schema import SubjectCreate, SubjectRead
from app.modules.subjects.service import SubjectService
from app.modules.users.model import UserRole

router = APIRouter(prefix="/subjects", tags=["subjects"])


def get_subject_service(session: AsyncSession = Depends(get_db_session)) -> SubjectService:
    return SubjectService(SubjectRepository(session))


@router.get("", response_model=list[SubjectRead])
async def list_subjects(
    service: SubjectService = Depends(get_subject_service),
) -> list[SubjectRead]:
    return await service.list_subjects()


@router.post("", response_model=SubjectRead, status_code=201)
async def create_subject(
    payload: SubjectCreate,
    service: SubjectService = Depends(get_subject_service),
    _: object = Depends(require_role(UserRole.tutor)),
) -> SubjectRead:
    return await service.create_subject(payload)
