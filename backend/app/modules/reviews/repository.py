from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.reviews.model import Review


class ReviewRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_by_reviewee(self, reviewee_id: int) -> list[Review]:
        result = await self.session.execute(
            select(Review).where(Review.reviewee_id == reviewee_id).order_by(Review.created_at.desc())
        )
        return list(result.scalars().all())

    async def create(self, review: Review) -> Review:
        self.session.add(review)
        await self.session.commit()
        await self.session.refresh(review)
        return review
