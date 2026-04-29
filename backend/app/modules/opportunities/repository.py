from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.opportunities.model import Opportunity
from app.modules.opportunities.schema import OpportunityUpdate


class OpportunityRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_all(self, published_only: bool = True) -> list[Opportunity]:
        query = select(Opportunity).order_by(Opportunity.created_at.desc())
        if published_only:
            query = query.where(Opportunity.is_published == True)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, opp_id: int) -> Opportunity | None:
        result = await self.session.execute(select(Opportunity).where(Opportunity.id == opp_id))
        return result.scalar_one_or_none()

    async def create(self, opp: Opportunity) -> Opportunity:
        self.session.add(opp)
        await self.session.commit()
        await self.session.refresh(opp)
        return opp

    async def update(self, opp: Opportunity, payload: OpportunityUpdate) -> Opportunity:
        updates = payload.model_dump(exclude_unset=True)
        for field, value in updates.items():
            setattr(opp, field, value)
        await self.session.commit()
        await self.session.refresh(opp)
        return opp

    async def delete(self, opp: Opportunity) -> None:
        await self.session.delete(opp)
        await self.session.commit()
