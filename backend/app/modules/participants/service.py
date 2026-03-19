from fastapi import HTTPException, status

from app.modules.participants.model import SessionParticipant
from app.modules.participants.repository import ParticipantRepository
from app.modules.participants.schema import SessionParticipantRead
from app.modules.sessions.repository import SessionRepository
from app.modules.users.model import User


class ParticipantService:
    def __init__(
        self,
        repository: ParticipantRepository,
        session_repository: SessionRepository,
    ) -> None:
        self.repository = repository
        self.session_repository = session_repository

    async def join_session(self, session_id: int, current_user: User) -> SessionParticipantRead:
        session = await self.session_repository.get_by_id(session_id)
        if session is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")

        existing_membership = await self.repository.get_membership(session_id, current_user.id)
        if existing_membership is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already joined this session.",
            )

        participant = SessionParticipant(session_id=session_id, user_id=current_user.id)
        created = await self.repository.create(participant)
        return SessionParticipantRead.model_validate(created)

    async def list_participants(self, session_id: int) -> list[SessionParticipantRead]:
        participants = await self.repository.list_by_session(session_id)
        return [SessionParticipantRead.model_validate(item) for item in participants]
