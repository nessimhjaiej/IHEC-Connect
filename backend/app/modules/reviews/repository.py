import uuid
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.reviews.model import Review


class ReviewRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_by_reviewee(self, reviewee_id: uuid.UUID) -> list[Review]:
        result = await self.session.execute(
            select(Review).where(Review.reviewee_id == reviewee_id).order_by(Review.created_at.desc())
        )
        return list(result.scalars().all())

    async def list_by_event(self, event_id: int) -> list[Review]:
        result = await self.session.execute(
            select(Review).where(Review.event_id == event_id).order_by(Review.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_existing(self, event_id: int, reviewer_id: uuid.UUID) -> Review | None:
        result = await self.session.execute(
            select(Review).where(
                Review.event_id == event_id,
                Review.reviewer_id == reviewer_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_average_for_tutor(self, tutor_id: uuid.UUID) -> tuple[float | None, int]:
        result = await self.session.execute(
            select(func.avg(Review.rating), func.count(Review.id)).where(Review.reviewee_id == tutor_id)
        )
        row = result.one()
        avg = float(row[0]) if row[0] is not None else None
        count = int(row[1])
        return avg, count

    async def create(self, review: Review) -> Review:
        self.session.add(review)
        await self.session.commit()
        await self.session.refresh(review)
        return review
