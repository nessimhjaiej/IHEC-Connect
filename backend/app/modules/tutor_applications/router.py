from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user, require_admin
from app.modules.tutor_applications.repository import TutorApplicationRepository
from app.modules.tutor_applications.schema import (
    TutorApplicationCreate,
    TutorApplicationRead,
    TutorApplicationStatusUpdate,
)
from app.modules.tutor_applications.service import TutorApplicationService
from app.modules.users.model import User

router = APIRouter(prefix="/tutor-applications", tags=["tutor_applications"])


def get_tutor_application_service(
    session: AsyncSession = Depends(get_db_session),
) -> TutorApplicationService:
    return TutorApplicationService(TutorApplicationRepository(session))


@router.get("/me", response_model=list[TutorApplicationRead])
async def list_my_tutor_applications(
    current_user: User = Depends(get_current_user),
    service: TutorApplicationService = Depends(get_tutor_application_service),
) -> list[TutorApplicationRead]:
    return await service.list_my_applications(current_user)


@router.post("", response_model=TutorApplicationRead, status_code=201)
async def create_tutor_application(
    payload: TutorApplicationCreate,
    current_user: User = Depends(get_current_user),
    service: TutorApplicationService = Depends(get_tutor_application_service),
) -> TutorApplicationRead:
    return await service.create_application(current_user, payload)


@router.patch("/{application_id}/status", response_model=TutorApplicationRead)
async def update_tutor_application_status(
    application_id: int,
    payload: TutorApplicationStatusUpdate,
    _: User = Depends(require_admin),
    service: TutorApplicationService = Depends(get_tutor_application_service),
) -> TutorApplicationRead:
    return await service.update_status(application_id, payload)
