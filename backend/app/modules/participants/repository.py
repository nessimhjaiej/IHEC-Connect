<<<<<<< HEAD
from sqlalchemy.orm import Session
from app.modules.participants.model import Participant

def get_all(db: Session, session_id=None):
    q = db.query(Participant)
    if session_id:
        q = q.filter(Participant.session_id == session_id)
    return q.all()
=======
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
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
