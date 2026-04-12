import uuid
from fastapi import HTTPException, status

from app.modules.events.repository import EventRepository
from app.modules.reviews.model import Review
from app.modules.reviews.repository import ReviewRepository
from app.modules.reviews.schema import ReviewCreate, ReviewRead, TutorRatingSummary
from app.modules.users.model import User


class ReviewService:
    def __init__(self, repository: ReviewRepository, event_repository: EventRepository) -> None:
        self.repository = repository
        self.event_repository = event_repository

    async def create_review(self, payload: ReviewCreate, current_user: User) -> ReviewRead:
        # Verify user participated in the event.
        participation = await self.event_repository.get_registration(payload.event_id, current_user.id)
        if participation is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You must have participated in this event to review it.",
            )
        # Check for duplicate review
        existing = await self.repository.get_existing(payload.event_id, current_user.id)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You already reviewed this event.")

        review = Review(**payload.model_dump(), reviewer_id=current_user.id)
        created = await self.repository.create(review)
        return ReviewRead.model_validate(created)

    async def list_reviews_for_tutor(self, tutor_id: uuid.UUID) -> list[ReviewRead]:
        reviews = await self.repository.list_by_reviewee(tutor_id)
        return [ReviewRead.model_validate(r) for r in reviews]

    async def list_reviews_for_event(self, event_id: int) -> list[ReviewRead]:
        reviews = await self.repository.list_by_event(event_id)
        return [ReviewRead.model_validate(r) for r in reviews]

    async def get_tutor_rating_summary(self, tutor_id: uuid.UUID) -> TutorRatingSummary:
        avg, count = await self.repository.get_average_for_tutor(tutor_id)
        return TutorRatingSummary(tutor_id=tutor_id, average_rating=avg, review_count=count)
