from pydantic import BaseModel, ConfigDict, Field


class AcademicYearCreate(BaseModel):
    label: str = Field(min_length=2, max_length=50)
    sort_order: int = 0


class AcademicYearRead(AcademicYearCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
