import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class OpportunityCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    company: str = Field(min_length=2, max_length=200)
    description: str | None = None
    opportunity_type: str = Field(default="internship", max_length=50)
    location: str | None = None
    is_remote: bool = False
    apply_url: str | None = None
    deadline: datetime | None = None
    is_published: bool = False


class OpportunityUpdate(BaseModel):
    title: str | None = None
    company: str | None = None
    description: str | None = None
    opportunity_type: str | None = None
    location: str | None = None
    is_remote: bool | None = None
    apply_url: str | None = None
    deadline: datetime | None = None
    is_published: bool | None = None


class OpportunityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    company: str
    description: str | None
    opportunity_type: str
    location: str | None
    is_remote: bool
    apply_url: str | None
    deadline: datetime | None
    is_published: bool
    created_by: uuid.UUID
    created_at: datetime
