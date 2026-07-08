from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class UserFull(BaseModel):
    uid: str
    name: str
    email: str
    role: str
    avatar_url: Optional[str] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class UserPatch(BaseModel):
    status: str


class PaginatedUsers(BaseModel):
    data: List[UserFull]
    pagination: dict
