from fastapi import HTTPException, status

from app.modules.events.repository import EventRepository
from app.modules.recordings.model import Recording
from app.modules.recordings.repository import RecordingRepository
from app.modules.recordings.schema import RecordingCreate, RecordingRead, RecordingValidationUpdate
from app.modules.users.model import User


class RecordingService:
    def __init__(self, repository: RecordingRepository, event_repository: EventRepository) -> None:
        self.repository = repository
        self.event_repository = event_repository

    async def list_for_event(self, event_id: int, current_user: User) -> list[RecordingRead]:
        if not current_user.is_admin:
            registration = await self.event_repository.get_registration(event_id, current_user.id)
            event = await self.event_repository.get_by_id(event_id)
            if registration is None and (event is None or event.host_user_id != current_user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to view these recordings.",
                )
        recordings = await self.repository.list_for_event(event_id)
        return [RecordingRead.model_validate(recording) for recording in recordings]

    async def create(self, current_user: User, payload: RecordingCreate) -> RecordingRead:
        event = await self.event_repository.get_by_id(payload.event_id)
        if event is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")
        if event.host_user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the event host can upload recordings.",
            )
        recording = Recording(
            event_id=payload.event_id,
            youtube_url=payload.youtube_url,
            uploaded_by=current_user.id,
        )
        created = await self.repository.create(recording)
        return RecordingRead.model_validate(created)

    async def validate(self, recording_id: int, payload: RecordingValidationUpdate) -> RecordingRead:
        recording = await self.repository.get_by_id(recording_id)
        if recording is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recording not found.")

        recording.validated = payload.validated
        updated = await self.repository.save(recording)
        return RecordingRead.model_validate(updated)
