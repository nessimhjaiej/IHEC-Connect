from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user, require_role
from app.modules.sessions.repository import SessionRepository
from app.modules.sessions.schema import SessionCreate, SessionDetail, SessionRead, SessionUpdate
from app.modules.sessions.service import SessionService
from app.modules.subjects.repository import SubjectRepository
from app.modules.users.model import User, UserRole

router = APIRouter(prefix="/sessions", tags=["sessions"])


def get_session_service(session: AsyncSession = Depends(get_db_session)) -> SessionService:
    return SessionService(SessionRepository(session), SubjectRepository(session))


@router.get("", response_model=list[SessionDetail])
async def list_sessions(
    subject_id: int | None = Query(default=None),
    service: SessionService = Depends(get_session_service),
) -> list[SessionDetail]:
    return await service.list_sessions(subject_id=subject_id)


@router.get("/mine", response_model=list[SessionDetail])
async def list_my_sessions(
    current_user: User = Depends(require_role(UserRole.tutor)),
    service: SessionService = Depends(get_session_service),
) -> list[SessionDetail]:
    return await service.list_my_sessions(current_user)


@router.get("/{session_id}", response_model=SessionDetail)
async def get_session(
    session_id: int,
    service: SessionService = Depends(get_session_service),
) -> SessionDetail:
    return await service.get_session(session_id)


@router.post("", response_model=SessionRead, status_code=201)
async def create_session(
    payload: SessionCreate,
    current_user: User = Depends(require_role(UserRole.tutor)),
    service: SessionService = Depends(get_session_service),
) -> SessionRead:
    return await service.create_session(current_user, payload)


@router.put("/{session_id}", response_model=SessionDetail)
async def update_session(
    session_id: int,
    payload: SessionUpdate,
    current_user: User = Depends(get_current_user),
    service: SessionService = Depends(get_session_service),
) -> SessionDetail:
    return await service.update_session(session_id, current_user, payload)


@router.delete("/{session_id}", status_code=204)
async def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    service: SessionService = Depends(get_session_service),
) -> None:
    await service.delete_session(session_id, current_user)
