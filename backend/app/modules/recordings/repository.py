from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.recordings.model import Recording


class RecordingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_for_event(self, event_id: int) -> list[Recording]:
        result = await self.session.execute(
            select(Recording).where(Recording.event_id == event_id).order_by(Recording.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, recording_id: int) -> Recording | None:
        result = await self.session.execute(select(Recording).where(Recording.id == recording_id))
        return result.scalar_one_or_none()

    async def create(self, recording: Recording) -> Recording:
        self.session.add(recording)
        await self.session.commit()
        await self.session.refresh(recording)
        return recording

    async def save(self, recording: Recording) -> Recording:
        await self.session.commit()
        await self.session.refresh(recording)
        return recording
