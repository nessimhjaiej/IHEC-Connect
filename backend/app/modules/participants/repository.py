from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.participants.model import SessionParticipant


class ParticipantRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_membership(self, session_id: int, user_id: int) -> SessionParticipant | None:
        query = select(SessionParticipant).where(
            SessionParticipant.session_id == session_id,
            SessionParticipant.user_id == user_id,
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def list_by_session(self, session_id: int) -> list[SessionParticipant]:
        query = select(SessionParticipant).where(SessionParticipant.session_id == session_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def create(self, participant: SessionParticipant) -> SessionParticipant:
        self.session.add(participant)
        await self.session.commit()
        await self.session.refresh(participant)
        return participant
