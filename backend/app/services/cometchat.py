"""CometChat REST API client — server-side only.

All UIDs are already mkt- namespaced at the DB layer.
COMETCHAT_API_KEY must be a fullAccess REST API key (Dashboard → API & Auth Keys).
"""
import logging
from typing import Optional

import httpx

from app.core.config import settings
from app.models.enums import UserRole

logger = logging.getLogger(__name__)

_ROLE_TAGS: dict[str, list[str]] = {
    UserRole.admin: ["admin", "moderator"],
    UserRole.seller: ["seller"],
    UserRole.buyer: ["buyer"],
    UserRole.moderator: ["moderator"],
    UserRole.smoke: ["smoke"],
}


def _is_configured() -> bool:
    return bool(settings.COMETCHAT_APP_ID and settings.COMETCHAT_API_KEY)


def _base_url() -> str:
    return f"https://{settings.COMETCHAT_APP_ID}.api-{settings.COMETCHAT_REGION}.cometchat.io/v3"


def _headers() -> dict:
    return {
        "appId": settings.COMETCHAT_APP_ID,
        "apiKey": settings.COMETCHAT_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


async def create_user(
    uid: str,
    name: str,
    role: UserRole,
    avatar_url: Optional[str] = None,
) -> bool:
    """Upsert a CometChat user. 409 (already exists) is treated as success."""
    if not _is_configured():
        return False

    tags = _ROLE_TAGS.get(role, [])
    payload: dict = {"uid": uid, "name": name, "tags": tags}
    if avatar_url:
        payload["avatar"] = avatar_url

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(f"{_base_url()}/users", headers=_headers(), json=payload)
        if resp.status_code == 409:
            return True
        if not resp.is_success:
            logger.error("CometChat create_user failed uid=%s status=%d body=%s", uid, resp.status_code, resp.text)
            return False
        return True


async def update_user(
    uid: str,
    name: Optional[str] = None,
    avatar_url: Optional[str] = None,
) -> bool:
    """Partial-update a CometChat user's name or avatar."""
    if not _is_configured():
        return False

    payload: dict = {}
    if name is not None:
        payload["name"] = name
    if avatar_url is not None:
        payload["avatar"] = avatar_url
    if not payload:
        return True

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.put(
            f"{_base_url()}/users/{uid}", headers=_headers(), json=payload
        )
        if not resp.is_success:
            logger.error("CometChat update_user failed uid=%s status=%d body=%s", uid, resp.status_code, resp.text)
            return False
        return True


async def delete_user(uid: str) -> bool:
    """Permanently delete a CometChat user."""
    if not _is_configured():
        return False

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.delete(f"{_base_url()}/users/{uid}", headers=_headers())
        if not resp.is_success:
            logger.error("CometChat delete_user failed uid=%s status=%d", uid, resp.status_code)
            return False
        return True


async def create_auth_token(uid: str) -> Optional[str]:
    """Mint a short-lived CometChat auth token for a user.

    Returns None when CometChat is not configured or the call fails.
    The caller should degrade gracefully (return empty string, not 500).
    """
    if not _is_configured():
        return None

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(
            f"{_base_url()}/users/{uid}/auth_tokens",
            headers=_headers(),
            json={},
        )
        if not resp.is_success:
            logger.error(
                "CometChat create_auth_token failed uid=%s status=%d body=%s",
                uid, resp.status_code, resp.text,
            )
            return None
        return resp.json().get("data", {}).get("authToken")
