from fastapi import HTTPException, status

from app.modules.tutor_applications.model import TutorApplication, TutorApplicationStatus
from app.modules.tutor_applications.repository import TutorApplicationRepository
from app.modules.tutor_applications.schema import (
    TutorApplicationCreate,
    TutorApplicationRead,
    TutorApplicationStatusUpdate,
)
from app.modules.users.model import User


class TutorApplicationService:
    def __init__(self, repository: TutorApplicationRepository) -> None:
        self.repository = repository

    async def list_my_applications(self, current_user: User) -> list[TutorApplicationRead]:
        applications = await self.repository.list_for_user(current_user.id)
        return [TutorApplicationRead.model_validate(application) for application in applications]

    async def create_application(
        self,
        current_user: User,
        payload: TutorApplicationCreate,
    ) -> TutorApplicationRead:
        application = TutorApplication(
            user_id=current_user.id,
            subject_id=payload.subject_id,
            grade=payload.grade,
            professor_id=payload.professor_id,
        )
        created = await self.repository.create(application)
        return TutorApplicationRead.model_validate(created)

    async def update_status(
        self,
        application_id: int,
        payload: TutorApplicationStatusUpdate,
    ) -> TutorApplicationRead:
        application = await self.repository.get_by_id(application_id)
        if application is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")

        application.status = payload.status

        # Approval stays the single unlock path for verified tutoring.
        if payload.status == TutorApplicationStatus.approved:
            application.user.can_tutor = True
            application.user.is_verified_tutor = True
        elif payload.status == TutorApplicationStatus.rejected:
            application.user.is_verified_tutor = False

        updated = await self.repository.save(application)
        return TutorApplicationRead.model_validate(updated)
