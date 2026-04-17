from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user, get_optional_user
from app.modules.events.repository import EventRepository
from app.modules.events.schema import EventCreate, EventParticipantRead, EventRead, EventUpdate
from app.modules.events.service import EventService
from app.modules.users.model import User

router = APIRouter(prefix="/events", tags=["events"])

def get_event_service(session: AsyncSession = Depends(get_db_session)) -> EventService:
    return EventService(EventRepository(session))


@router.get("", response_model=list[EventRead])
async def list_events(
    service: EventService = Depends(get_event_service),
    current_user: User | None = Depends(get_optional_user),
) -> list[EventRead]:
    return await service.list_events(current_user=current_user)


@router.get("/{event_id}", response_model=EventRead)
async def get_event(
    event_id: int,
    service: EventService = Depends(get_event_service),
) -> EventRead:
    return await service.get_event(event_id)


@router.post("", response_model=EventRead, status_code=201)
async def create_event(
    payload: EventCreate,
    current_user: User = Depends(get_current_user),
    service: EventService = Depends(get_event_service),
) -> EventRead:
    return await service.create_event(current_user, payload)


@router.put("/{event_id}", response_model=EventRead)
async def update_event(
    event_id: int,
    payload: EventUpdate,
    current_user: User = Depends(get_current_user),
    service: EventService = Depends(get_event_service),
) -> EventRead:
    return await service.update_event(event_id, current_user, payload)


@router.delete("/{event_id}", status_code=204)
async def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    service: EventService = Depends(get_event_service),
) -> None:
    await service.delete_event(event_id, current_user)


@router.post("/{event_id}/register", response_model=EventParticipantRead, status_code=201)
async def register_to_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    service: EventService = Depends(get_event_service),
) -> EventParticipantRead:
    return await service.register_to_event(event_id, current_user)


@router.delete("/{event_id}/register", status_code=204)
async def unregister_from_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    service: EventService = Depends(get_event_service),
) -> None:
    await service.unregister_from_event(event_id, current_user)
