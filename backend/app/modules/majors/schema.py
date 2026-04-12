from pydantic import BaseModel, ConfigDict, Field


class MajorCreate(BaseModel):
    code: str = Field(min_length=2, max_length=50)
    name: str = Field(min_length=2, max_length=120)


class MajorRead(MajorCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
