from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user
from app.modules.auth.repository import AuthRepository
from app.modules.auth.schema import SessionResponse
from app.modules.auth.service import AuthService
from app.modules.users.model import User

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service(session: AsyncSession = Depends(get_db_session)) -> AuthService:
    return AuthService(AuthRepository(session))


@router.get("/session", response_model=SessionResponse)
async def get_session(
    current_user: User = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
) -> SessionResponse:
    return await service.get_session(str(current_user.id))
