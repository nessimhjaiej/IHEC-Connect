from app.modules.majors.model import Major
from app.modules.majors.repository import MajorRepository
from app.modules.majors.schema import MajorCreate, MajorRead


class MajorService:
    def __init__(self, repository: MajorRepository) -> None:
        self.repository = repository

    async def list_majors(self) -> list[MajorRead]:
        majors = await self.repository.list_majors()
        return [MajorRead.model_validate(major) for major in majors]

    async def create_major(self, payload: MajorCreate) -> MajorRead:
        major = Major(**payload.model_dump())
        created = await self.repository.create(major)
        return MajorRead.model_validate(created)
