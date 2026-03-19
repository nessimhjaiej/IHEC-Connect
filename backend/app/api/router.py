from fastapi import APIRouter

from app.modules.auth.router import router as auth_router
from app.modules.participants.router import router as participants_router
from app.modules.reviews.router import router as reviews_router
from app.modules.sessions.router import router as sessions_router
from app.modules.subjects.router import router as subjects_router
from app.modules.users.router import router as users_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(subjects_router)
api_router.include_router(sessions_router)
api_router.include_router(participants_router)
api_router.include_router(reviews_router)
