from fastapi import APIRouter, Depends
<<<<<<< HEAD
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.modules.participants.schema import ParticipantOut
from app.modules.participants import service

router = APIRouter()

@router.get("/", response_model=List[ParticipantOut])
def list_participants(session_id: Optional[int] = None, db: Session = Depends(get_db)):
    return service.get_participants(db, session_id)
=======
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user
from app.modules.participants.repository import ParticipantRepository
from app.modules.participants.schema import SessionParticipantRead
from app.modules.participants.service import ParticipantService
from app.modules.sessions.repository import SessionRepository
from app.modules.users.model import User

router = APIRouter(prefix="/participants", tags=["participants"])


def get_participant_service(
    session: AsyncSession = Depends(get_db_session),
) -> ParticipantService:
    return ParticipantService(ParticipantRepository(session), SessionRepository(session))


@router.get("/session/{session_id}", response_model=list[SessionParticipantRead])
async def list_participants(
    session_id: int,
    service: ParticipantService = Depends(get_participant_service),
) -> list[SessionParticipantRead]:
    return await service.list_participants(session_id)


@router.post("/session/{session_id}/join", response_model=SessionParticipantRead, status_code=201)
async def join_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    service: ParticipantService = Depends(get_participant_service),
) -> SessionParticipantRead:
    return await service.join_session(session_id, current_user)
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
