from fastapi import HTTPException, status

from app.modules.sessions.model import Session
from app.modules.sessions.repository import SessionRepository
from app.modules.sessions.schema import (
    SessionCreate, SessionDetail, SessionRead, SessionUpdate,
)
from app.modules.subjects.repository import SubjectRepository
from app.modules.users.model import User, UserRole


class SessionService:
    def __init__(self, repository: SessionRepository, subject_repository: SubjectRepository) -> None:
        self.repository = repository
        self.subject_repository = subject_repository

    async def _to_detail(self, session: Session) -> SessionDetail:
        count = await self.repository.get_participant_count(session.id)
        avg = await self.repository.get_average_rating(session.id)
        return SessionDetail(
            **SessionRead.model_validate(session).model_dump(),
            tutor=session.tutor,
            subject=session.subject,
            participant_count=count,
            average_rating=avg,
        )

    async def list_sessions(self, subject_id: int | None = None) -> list[SessionDetail]:
        sessions = await self.repository.list_sessions(subject_id=subject_id)
        return [await self._to_detail(s) for s in sessions]

    async def list_my_sessions(self, current_user: User) -> list[SessionDetail]:
        sessions = await self.repository.list_by_tutor(current_user.id)
        return [await self._to_detail(s) for s in sessions]

    async def get_session(self, session_id: int) -> SessionDetail:
        session = await self.repository.get_by_id(session_id)
        if session is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")
        return await self._to_detail(session)

    async def create_session(self, current_user: User, payload: SessionCreate) -> SessionRead:
        subject = await self.subject_repository.get_by_id(payload.subject_id)
        if subject is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found.")
        session_obj = Session(**payload.model_dump(), tutor_id=current_user.id)
        created = await self.repository.create(session_obj)
        return SessionRead.model_validate(created)

    async def update_session(self, session_id: int, current_user: User, payload: SessionUpdate) -> SessionDetail:
        session = await self.repository.get_by_id(session_id)
        if session is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")
        if session.tutor_id != current_user.id and current_user.role != UserRole.admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")
        updated = await self.repository.update(session, payload)
        return await self._to_detail(updated)

    async def delete_session(self, session_id: int, current_user: User) -> None:
        session = await self.repository.get_by_id(session_id)
        if session is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")
        if session.tutor_id != current_user.id and current_user.role != UserRole.admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")
        await self.repository.delete(session)
