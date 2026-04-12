from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user, get_optional_user, require_role
from app.modules.opportunities.repository import OpportunityRepository
from app.modules.opportunities.schema import OpportunityCreate, OpportunityRead, OpportunityUpdate
from app.modules.opportunities.service import OpportunityService
from app.modules.users.model import User, UserRole

router = APIRouter(prefix="/opportunities", tags=["opportunities"])

def get_opp_service(session: AsyncSession = Depends(get_db_session)) -> OpportunityService:
    return OpportunityService(OpportunityRepository(session))


@router.get("", response_model=list[OpportunityRead])
async def list_opportunities(
    service: OpportunityService = Depends(get_opp_service),
    current_user: User | None = Depends(get_optional_user),
) -> list[OpportunityRead]:
    return await service.list_opportunities(current_user=current_user)


@router.get("/{opp_id}", response_model=OpportunityRead)
async def get_opportunity(
    opp_id: int,
    service: OpportunityService = Depends(get_opp_service),
) -> OpportunityRead:
    return await service.get_opportunity(opp_id)


@router.post("", response_model=OpportunityRead, status_code=201)
async def create_opportunity(
    payload: OpportunityCreate,
    current_user: User = Depends(require_role(UserRole.admin)),
    service: OpportunityService = Depends(get_opp_service),
) -> OpportunityRead:
    return await service.create_opportunity(current_user, payload)


@router.put("/{opp_id}", response_model=OpportunityRead)
async def update_opportunity(
    opp_id: int,
    payload: OpportunityUpdate,
    _: User = Depends(require_role(UserRole.admin)),
    service: OpportunityService = Depends(get_opp_service),
) -> OpportunityRead:
    return await service.update_opportunity(opp_id, payload)


@router.delete("/{opp_id}", status_code=204)
async def delete_opportunity(
    opp_id: int,
    _: User = Depends(require_role(UserRole.admin)),
    service: OpportunityService = Depends(get_opp_service),
) -> None:
    await service.delete_opportunity(opp_id)
