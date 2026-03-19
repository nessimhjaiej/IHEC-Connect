from fastapi import HTTPException, status

from app.modules.subjects.model import Subject
from app.modules.subjects.repository import SubjectRepository
from app.modules.subjects.schema import SubjectCreate, SubjectRead


class SubjectService:
    def __init__(self, repository: SubjectRepository) -> None:
        self.repository = repository

    async def list_subjects(self) -> list[SubjectRead]:
        subjects = await self.repository.list_subjects()
        return [SubjectRead.model_validate(subject) for subject in subjects]

    async def create_subject(self, payload: SubjectCreate) -> SubjectRead:
        existing_subject = await self.repository.get_by_name(payload.name)
        if existing_subject is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Subject already exists.",
            )
        subject = Subject(**payload.model_dump())
        created = await self.repository.create(subject)
        return SubjectRead.model_validate(created)
