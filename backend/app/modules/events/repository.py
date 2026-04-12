import uuid
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.events.model import Event, EventParticipant
from app.modules.events.schema import EventCreate, EventUpdate


class EventRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_events(self) -> list[Event]:
        query = select(Event).order_by(Event.starts_at.asc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, event_id: int) -> Event | None:
        result = await self.session.execute(select(Event).where(Event.id == event_id))
        return result.scalar_one_or_none()

    async def get_registration_count(self, event_id: int) -> int:
        result = await self.session.execute(
            select(func.count(EventParticipant.id)).where(EventParticipant.event_id == event_id)
        )
        return int(result.scalar() or 0)

    async def get_registration(self, event_id: int, user_id: uuid.UUID) -> EventParticipant | None:
        result = await self.session.execute(
            select(EventParticipant).where(
                EventParticipant.event_id == event_id,
                EventParticipant.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_registrations_by_user(self, user_id: uuid.UUID) -> list[EventParticipant]:
        result = await self.session.execute(
            select(EventParticipant).where(EventParticipant.user_id == user_id)
        )
        return list(result.scalars().all())

    async def create_event(self, event: Event) -> Event:
        self.session.add(event)
        await self.session.commit()
        await self.session.refresh(event)
        return event

    async def update_event(self, event: Event, payload: EventUpdate) -> Event:
        updates = payload.model_dump(exclude_unset=True)
        for field, value in updates.items():
            setattr(event, field, value)
        await self.session.commit()
        await self.session.refresh(event)
        return event

    async def delete_event(self, event: Event) -> None:
        await self.session.delete(event)
        await self.session.commit()

    async def create_registration(self, reg: EventParticipant) -> EventParticipant:
        self.session.add(reg)
        await self.session.commit()
        await self.session.refresh(reg)
        return reg

    async def delete_registration(self, reg: EventParticipant) -> None:
        await self.session.delete(reg)
        await self.session.commit()
