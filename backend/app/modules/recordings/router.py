from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user, require_admin
from app.modules.recordings.repository import RecordingRepository
from app.modules.recordings.schema import RecordingCreate, RecordingRead, RecordingValidationUpdate
from app.modules.recordings.service import RecordingService
from app.modules.users.model import User

router = APIRouter(prefix="/recordings", tags=["recordings"])


def get_recording_service(
    session: AsyncSession = Depends(get_db_session),
) -> RecordingService:
    return RecordingService(RecordingRepository(session))


@router.get("/event/{event_id}", response_model=list[RecordingRead])
async def list_recordings_for_event(
    event_id: int,
    service: RecordingService = Depends(get_recording_service),
) -> list[RecordingRead]:
    return await service.list_for_event(event_id)


@router.post("", response_model=RecordingRead, status_code=201)
async def create_recording(
    payload: RecordingCreate,
    current_user: User = Depends(get_current_user),
    service: RecordingService = Depends(get_recording_service),
) -> RecordingRead:
    return await service.create(current_user, payload)


@router.patch("/{recording_id}/validation", response_model=RecordingRead)
async def validate_recording(
    recording_id: int,
    payload: RecordingValidationUpdate,
    _: User = Depends(require_admin),
    service: RecordingService = Depends(get_recording_service),
) -> RecordingRead:
    return await service.validate(recording_id, payload)
