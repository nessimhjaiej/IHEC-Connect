from fastapi import HTTPException, status

from app.modules.events.model import Event, EventParticipant
from app.modules.events.repository import EventRepository
from app.modules.events.schema import EventCreate, EventParticipantRead, EventRead, EventUpdate
from app.modules.users.model import User


class EventService:
    def __init__(self, repository: EventRepository) -> None:
        self.repository = repository

    async def _to_read(self, event: Event) -> EventRead:
        count = await self.repository.get_registration_count(event.id)
        data = {
            "id": event.id,
            "type": event.type,
            "title": event.title,
            "description": event.description,
            "host_user_id": event.host_user_id,
            "subject_id": event.subject_id,
            "major_id": event.major_id,
            "academic_year_id": event.academic_year_id,
            "delivery_mode": event.delivery_mode,
            "location_text": event.location_text,
            "meeting_url": event.meeting_url,
            "starts_at": event.starts_at,
            "ends_at": event.ends_at,
            "capacity": event.capacity,
            "created_at": event.created_at,
            "participant_count": count,
        }
        return EventRead.model_validate(data)

    async def list_events(self, current_user: User | None = None) -> list[EventRead]:
        _ = current_user
        events = await self.repository.list_events()
        return [await self._to_read(e) for e in events]

    async def get_event(self, event_id: int) -> EventRead:
        event = await self.repository.get_by_id(event_id)
        if event is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")
        return await self._to_read(event)

    async def create_event(self, current_user: User, payload: EventCreate) -> EventRead:
        event = Event(**payload.model_dump(), host_user_id=current_user.id)
        created = await self.repository.create_event(event)
        return await self._to_read(created)

    async def update_event(self, event_id: int, current_user: User, payload: EventUpdate) -> EventRead:
        event = await self.repository.get_by_id(event_id)
        if event is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")
        updated = await self.repository.update_event(event, payload)
        return await self._to_read(updated)

    async def delete_event(self, event_id: int, current_user: User) -> None:
        event = await self.repository.get_by_id(event_id)
        if event is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")
        await self.repository.delete_event(event)

    async def register_to_event(self, event_id: int, current_user: User) -> EventParticipantRead:
        event = await self.repository.get_by_id(event_id)
        if event is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")

        existing = await self.repository.get_registration(event_id, current_user.id)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already registered.")

        count = await self.repository.get_registration_count(event_id)
        if count >= event.capacity:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Event is full.")

        reg = EventParticipant(event_id=event_id, user_id=current_user.id)
        created = await self.repository.create_registration(reg)
        return EventParticipantRead.model_validate(created)

    async def unregister_from_event(self, event_id: int, current_user: User) -> None:
        reg = await self.repository.get_registration(event_id, current_user.id)
        if reg is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registration not found.")
        await self.repository.delete_registration(reg)
