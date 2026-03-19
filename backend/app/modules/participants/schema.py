from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SessionParticipantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    session_id: int
    user_id: int
    joined_at: datetime
