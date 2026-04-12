from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.security import decode_supabase_token
from app.modules.users.model import User, UserRole
from app.modules.users.repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/session")


async def _get_user_from_token(token: str, session: AsyncSession) -> User:
    payload = await decode_supabase_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials.",
        )
    subject = payload.get("sub")
    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication subject is missing.",
        )
    user = await UserRepository(session).get_by_id(subject)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )
    return user


async def get_current_user(
    session: AsyncSession = Depends(get_db_session),
    token: str = Depends(oauth2_scheme),
) -> User:
    return await _get_user_from_token(token, session)


def require_role(role: UserRole):
    async def role_dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )
        return current_user
    return role_dependency


def require_roles(*roles: UserRole):
    async def roles_dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )
        return current_user
    return roles_dependency


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Security(HTTPBearer(auto_error=False)),
    db: AsyncSession = Depends(get_db_session)
) -> User | None:
    if credentials is None:
        return None
    try:
        return await _get_user_from_token(credentials.credentials, db)
    except HTTPException:
        return None
