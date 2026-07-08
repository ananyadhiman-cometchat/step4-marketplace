from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, UserOut
from app.services import cometchat as cometchat_service

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(subject=user.uid, role=user.role)

    # Ensure this user exists in CometChat (idempotent — 409 is fine on repeated logins).
    # UIDs are already mkt- prefixed; RBAC role maps to CometChat tags.
    await cometchat_service.create_user(user.uid, user.name, user.role, user.avatar_url)
    cc_token = await cometchat_service.create_auth_token(user.uid) or ""

    return LoginResponse(
        token=token,
        cometchat_auth_token=cc_token,
        user=UserOut.model_validate(user),
    )
