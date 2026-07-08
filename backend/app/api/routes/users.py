from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_roles
from app.db.session import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.user import PaginatedUsers, UserFull, UserPatch

router = APIRouter()


@router.get("", response_model=PaginatedUsers)
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
):
    q = select(User)
    total = (await db.execute(select(func.count()).select_from(q.subquery()))).scalar_one()
    rows = (await db.execute(q.offset((page - 1) * limit).limit(limit))).scalars().all()

    return PaginatedUsers(
        data=[UserFull.model_validate(u) for u in rows],
        pagination={"page": page, "limit": limit, "total": total},
    )


@router.patch("/{uid}", response_model=UserFull)
async def patch_user(
    uid: str,
    body: UserPatch,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
):
    user = await db.get(User, uid)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.status = body.status
    await db.commit()
    await db.refresh(user)
    return UserFull.model_validate(user)
