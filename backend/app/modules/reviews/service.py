from app.modules.reviews.model import Review
from app.modules.reviews.repository import ReviewRepository
from app.modules.reviews.schema import ReviewCreate, ReviewRead
from app.modules.users.model import User


class ReviewService:
    def __init__(self, repository: ReviewRepository) -> None:
        self.repository = repository

    async def create_review(self, payload: ReviewCreate, current_user: User) -> ReviewRead:
        review = Review(**payload.model_dump(), reviewer_id=current_user.id)
        created = await self.repository.create(review)
        return ReviewRead.model_validate(created)

    async def list_reviews_for_user(self, reviewee_id: int) -> list[ReviewRead]:
        reviews = await self.repository.list_by_reviewee(reviewee_id)
        return [ReviewRead.model_validate(item) for item in reviews]
