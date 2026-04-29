from fastapi import HTTPException, status

from app.modules.opportunities.model import Opportunity
from app.modules.opportunities.repository import OpportunityRepository
from app.modules.opportunities.schema import OpportunityCreate, OpportunityRead, OpportunityUpdate
from app.modules.users.model import User, UserRole


class OpportunityService:
    def __init__(self, repository: OpportunityRepository) -> None:
        self.repository = repository

    async def list_opportunities(self, current_user: User | None = None) -> list[OpportunityRead]:
        published_only = current_user is None or current_user.role != UserRole.admin
        opps = await self.repository.list_all(published_only=published_only)
        return [OpportunityRead.model_validate(o) for o in opps]

    async def get_opportunity(self, opp_id: int) -> OpportunityRead:
        opp = await self.repository.get_by_id(opp_id)
        if opp is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found.")
        return OpportunityRead.model_validate(opp)

    async def create_opportunity(self, current_user: User, payload: OpportunityCreate) -> OpportunityRead:
        opp = Opportunity(**payload.model_dump(), created_by=current_user.id)
        created = await self.repository.create(opp)
        return OpportunityRead.model_validate(created)

    async def update_opportunity(self, opp_id: int, payload: OpportunityUpdate) -> OpportunityRead:
        opp = await self.repository.get_by_id(opp_id)
        if opp is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found.")
        updated = await self.repository.update(opp, payload)
        return OpportunityRead.model_validate(updated)

    async def delete_opportunity(self, opp_id: int) -> None:
        opp = await self.repository.get_by_id(opp_id)
        if opp is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found.")
        await self.repository.delete(opp)
