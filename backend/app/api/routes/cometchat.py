"""CometChat endpoints — auth token refresh for the client SDK."""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.models.user import User
from app.services import cometchat as cometchat_service

router = APIRouter()


class TokenResponse(BaseModel):
    cometchat_auth_token: str


@router.post("/token", response_model=TokenResponse)
async def refresh_cometchat_token(current_user: User = Depends(get_current_user)):
    """Mint a fresh CometChat auth token for the authenticated user.

    Called by the client when the previous token expires (SDK disconnects).
    """
    await cometchat_service.create_user(
        current_user.uid, current_user.name, current_user.role, current_user.avatar_url
    )
    token = await cometchat_service.create_auth_token(current_user.uid)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="CometChat not configured",
        )
    return TokenResponse(cometchat_auth_token=token)
