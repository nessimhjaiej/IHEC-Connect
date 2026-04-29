<<<<<<< HEAD
from pydantic import BaseModel

class ParticipantOut(BaseModel):
    id: int
    user_id: int
    session_id: int
    class Config:
        from_attributes = True
=======
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SessionParticipantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    session_id: int
    user_id: uuid.UUID
    joined_at: datetime
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
