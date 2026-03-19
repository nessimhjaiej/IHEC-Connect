from fastapi import HTTPException, status

from app.modules.sessions.model import Session
from app.modules.sessions.repository import SessionRepository
from app.modules.sessions.schema import SessionCreate, SessionDetail, SessionRead
from app.modules.subjects.repository import SubjectRepository
from app.modules.users.model import User


class SessionService:
    def __init__(
        self,
        repository: SessionRepository,
        subject_repository: SubjectRepository,
    ) -> None:
        self.repository = repository
        self.subject_repository = subject_repository

    async def list_sessions(self) -> list[SessionDetail]:
        sessions = await self.repository.list_sessions()
        items: list[SessionDetail] = []
        for session in sessions:
            participant_count = await self.repository.get_participant_count(session.id)
            items.append(
                SessionDetail(
                    **SessionRead.model_validate(session).model_dump(),
                    tutor=session.tutor,
                    subject=session.subject,
                    participant_count=participant_count,
                )
            )
        return items

    async def get_session(self, session_id: int) -> SessionDetail:
        session = await self.repository.get_by_id(session_id)
        if session is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")

        participant_count = await self.repository.get_participant_count(session.id)
        return SessionDetail(
            **SessionRead.model_validate(session).model_dump(),
            tutor=session.tutor,
            subject=session.subject,
            participant_count=participant_count,
        )

    async def create_session(self, current_user: User, payload: SessionCreate) -> SessionRead:
        subject = await self.subject_repository.get_by_id(payload.subject_id)
        if subject is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found.")

        session_obj = Session(**payload.model_dump(), tutor_id=current_user.id)
        created = await self.repository.create(session_obj)
        return SessionRead.model_validate(created)
