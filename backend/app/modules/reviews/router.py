import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user
from app.modules.events.repository import EventRepository
from app.modules.reviews.repository import ReviewRepository
from app.modules.reviews.schema import ReviewCreate, ReviewRead, TutorRatingSummary
from app.modules.reviews.service import ReviewService
from app.modules.users.model import User

router = APIRouter(prefix="/reviews", tags=["reviews"])


def get_review_service(session: AsyncSession = Depends(get_db_session)) -> ReviewService:
    return ReviewService(ReviewRepository(session), EventRepository(session))


@router.post("", response_model=ReviewRead, status_code=201)
async def create_review(
    payload: ReviewCreate,
    current_user: User = Depends(get_current_user),
    service: ReviewService = Depends(get_review_service),
) -> ReviewRead:
    return await service.create_review(payload, current_user)


@router.get("/tutor/{tutor_id}", response_model=list[ReviewRead])
async def list_reviews_for_tutor(
    tutor_id: uuid.UUID,
    service: ReviewService = Depends(get_review_service),
) -> list[ReviewRead]:
    return await service.list_reviews_for_tutor(tutor_id)


@router.get("/event/{event_id}", response_model=list[ReviewRead])
async def list_reviews_for_event(
    event_id: int,
    service: ReviewService = Depends(get_review_service),
) -> list[ReviewRead]:
    return await service.list_reviews_for_event(event_id)


@router.get("/tutor/{tutor_id}/summary", response_model=TutorRatingSummary)
async def get_tutor_rating_summary(
    tutor_id: uuid.UUID,
    service: ReviewService = Depends(get_review_service),
) -> TutorRatingSummary:
    return await service.get_tutor_rating_summary(tutor_id)
