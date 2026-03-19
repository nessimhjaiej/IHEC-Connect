from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.participants.model import SessionParticipant
from app.modules.sessions.model import Session


class SessionRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_sessions(self) -> list[Session]:
        query = (
            select(Session)
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
        query = select(func.count(SessionParticipant.id)).where(
            SessionParticipant.session_id == session_id
        )
        result = await self.session.execute(query)
        return int(result.scalar() or 0)

    async def create(self, session_obj: Session) -> Session:
        self.session.add(session_obj)
        await self.session.commit()
        await self.session.refresh(session_obj)
        return session_obj
