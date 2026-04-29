<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.users.schema import UserOut, UserUpdate
from app.modules.users import service
from app.modules.users.model import User
from typing import List

router = APIRouter()


@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return service.get_all_users(db)


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    user = service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    user = service.update_user(db, user_id, data.model_dump(exclude_none=True))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
=======
import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user, require_admin
from app.modules.users.model import User
from app.modules.users.repository import UserRepository
from app.modules.users.schema import UserAdminUpdate, UserRead, UserUpdate
from app.modules.users.service import UserService

router = APIRouter(prefix="/users", tags=["users"])


def get_user_service(session: AsyncSession = Depends(get_db_session)) -> UserService:
    return UserService(UserRepository(session))


@router.get("/me", response_model=UserRead)
async def read_current_user(current_user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)


@router.put("/me", response_model=UserRead)
async def update_current_user(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
) -> UserRead:
    return await service.update_profile(current_user, payload)


@router.get("", response_model=list[UserRead])
async def list_users(
    is_tutor: bool | None = Query(default=None),
    is_alumni: bool | None = Query(default=None),
    is_admin: bool | None = Query(default=None),
    _: User = Depends(require_admin),
    service: UserService = Depends(get_user_service),
) -> list[UserRead]:
    return await service.list_users(
        is_tutor=is_tutor,
        is_alumni=is_alumni,
        is_admin=is_admin,
    )


@router.get("/tutors", response_model=list[UserRead])
async def list_tutors(service: UserService = Depends(get_user_service)) -> list[UserRead]:
    return await service.list_tutors()


@router.get("/{user_id}", response_model=UserRead)
async def get_user(
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
) -> UserRead:
    return await service.get_profile(user_id, current_user)


# Admin: activate/deactivate user
@router.patch("/{user_id}/admin", response_model=UserRead)
async def admin_update_user(
    user_id: uuid.UUID,
    payload: UserAdminUpdate,
    service: UserService = Depends(get_user_service),
    _: User = Depends(require_admin),
) -> UserRead:
    return await service.admin_update_user(user_id, payload)
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
