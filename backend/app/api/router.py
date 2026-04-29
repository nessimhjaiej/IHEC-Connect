from fastapi import APIRouter
<<<<<<< HEAD
from app.modules.auth.router import router as auth_router
from app.modules.users.router import router as users_router
from app.modules.sessions.router import router as sessions_router
from app.modules.subjects.router import router as subjects_router
from app.modules.participants.router import router as participants_router
from app.modules.reviews.router import router as reviews_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(sessions_router, prefix="/sessions", tags=["sessions"])
api_router.include_router(subjects_router, prefix="/subjects", tags=["subjects"])
api_router.include_router(participants_router, prefix="/participants", tags=["participants"])
api_router.include_router(reviews_router, prefix="/reviews", tags=["reviews"])
=======

from app.modules.auth.router import router as auth_router
from app.modules.academic_years.router import router as academic_years_router
from app.modules.majors.router import router as majors_router
from app.modules.users.router import router as users_router
from app.modules.subjects.router import router as subjects_router
from app.modules.sessions.router import router as sessions_router
from app.modules.participants.router import router as participants_router
from app.modules.reviews.router import router as reviews_router
from app.modules.documents.router import router as documents_router
from app.modules.events.router import router as events_router
from app.modules.opportunities.router import router as opportunities_router
from app.modules.recordings.router import router as recordings_router
from app.modules.tutor_applications.router import router as tutor_applications_router



api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(academic_years_router)
api_router.include_router(majors_router)
api_router.include_router(users_router)
api_router.include_router(subjects_router)
api_router.include_router(sessions_router)
api_router.include_router(participants_router)
api_router.include_router(reviews_router)
api_router.include_router(documents_router)
api_router.include_router(events_router)
api_router.include_router(opportunities_router)
api_router.include_router(tutor_applications_router)
api_router.include_router(recordings_router)
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
