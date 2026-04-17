from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user
from app.modules.auth.repository import AuthRepository
from app.modules.auth.schema import RegisterProfileRequest, SessionResponse
from app.modules.auth.service import AuthService
from app.modules.users.model import StudentProfile, User
from app.modules.users.repository import UserRepository
from app.modules.users.schema import UserRead

router = APIRouter(prefix="/auth", tags=["auth"])



def get_auth_service(session: AsyncSession = Depends(get_db_session)) -> AuthService:
    return AuthService(AuthRepository(session))


@router.post("/register", response_model=SessionResponse)
async def register_profile(
    payload: RegisterProfileRequest,
    session: AsyncSession = Depends(get_db_session),
) -> SessionResponse:
    user = User(
        id=payload.id,
        full_name=payload.full_name,
        email=payload.email,
        is_active=True,
        student_profile=StudentProfile(
            id=payload.id,
            major_id=payload.major_id,
            academic_year_id=payload.academic_year_id,
            is_tutor=False,
            is_alumni=False,
        ),
    )
    saved = await UserRepository(session).upsert(user)
    return SessionResponse(user=UserRead.model_validate(saved))


@router.get("/session", response_model=SessionResponse)
async def get_session(
    current_user: User = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
) -> SessionResponse:
    return await service.get_session(str(current_user.id))
