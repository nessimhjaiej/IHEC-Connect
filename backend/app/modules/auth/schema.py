from pydantic import BaseModel

from app.modules.users.schema import UserRead


class SessionResponse(BaseModel):
    user: UserRead
