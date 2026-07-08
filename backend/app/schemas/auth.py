from typing import Optional

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    uid: str
    name: str
    role: str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


class LoginResponse(BaseModel):
    token: str
    cometchat_auth_token: str
    user: UserOut
