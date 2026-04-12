import uuid
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.participants.model import SessionParticipant
from app.modules.reviews.model import Review
from app.modules.sessions.model import Session
from app.modules.sessions.schema import SessionUpdate


class SessionRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_sessions(self, subject_id: int | None = None) -> list[Session]:
        query = (
            select(Session)
            .options(selectinload(Session.tutor), selectinload(Session.subject))
            .order_by(Session.scheduled_at.asc())
        )
        if subject_id:
            query = query.where(Session.subject_id == subject_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def list_by_tutor(self, tutor_id: uuid.UUID) -> list[Session]:
        query = (
            select(Session)
            .where(Session.tutor_id == tutor_id)
            .options(selectinload(Session.tutor), selectinload(Session.subject))
            .order_by(Session.scheduled_at.asc())
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, session_id: int) -> Session | None:
        query = (
            select(Session)
            .where(Session.id == session_id)
            .options(selectinload(Session.tutor), selectinload(Session.subject))
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_participant_count(self, session_id: int) -> int:
        result = await self.session.execute(
            select(func.count(SessionParticipant.id)).where(SessionParticipant.session_id == session_id)
        )
        return int(result.scalar() or 0)

    async def get_average_rating(self, session_id: int) -> float | None:
        result = await self.session.execute(
            select(func.avg(Review.rating)).where(Review.session_id == session_id)
        )
        val = result.scalar()
        return float(val) if val is not None else None

    async def create(self, session_obj: Session) -> Session:
        self.session.add(session_obj)
        await self.session.commit()
        await self.session.refresh(session_obj)
        return session_obj

    async def update(self, session_obj: Session, payload: SessionUpdate) -> Session:
        updates = payload.model_dump(exclude_unset=True)
        for field, value in updates.items():
            setattr(session_obj, field, value)
        await self.session.commit()
        await self.session.refresh(session_obj)
        return session_obj

    async def delete(self, session_obj: Session) -> None:
        await self.session.delete(session_obj)
        await self.session.commit()
