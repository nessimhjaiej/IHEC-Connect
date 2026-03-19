from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import require_role
from app.modules.sessions.repository import SessionRepository
from app.modules.sessions.schema import SessionCreate, SessionDetail, SessionRead
from app.modules.sessions.service import SessionService
from app.modules.subjects.repository import SubjectRepository
from app.modules.users.model import User, UserRole

router = APIRouter(prefix="/sessions", tags=["sessions"])


def get_session_service(session: AsyncSession = Depends(get_db_session)) -> SessionService:
    return SessionService(SessionRepository(session), SubjectRepository(session))


@router.get("", response_model=list[SessionDetail])
async def list_sessions(
    service: SessionService = Depends(get_session_service),
) -> list[SessionDetail]:
    return await service.list_sessions()


@router.get("/{session_id}", response_model=SessionDetail)
async def get_session(
    session_id: int,
    service: SessionService = Depends(get_session_service),
) -> SessionDetail:
    return await service.get_session(session_id)


@router.post("", response_model=SessionRead, status_code=201)
async def create_session(
    payload: SessionCreate,
    service: SessionService = Depends(get_session_service),
    current_user: User = Depends(require_role(UserRole.tutor)),
) -> SessionRead:
    return await service.create_session(current_user, payload)
