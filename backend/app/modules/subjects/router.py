from fastapi import APIRouter, Depends
<<<<<<< HEAD
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.subjects.schema import SubjectOut
from app.modules.subjects import service
from typing import List

router = APIRouter()

@router.get("/", response_model=List[SubjectOut])
def list_subjects(db: Session = Depends(get_db)):
    return service.get_all_subjects(db)
=======
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
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
