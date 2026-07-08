import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.enums import ListingStatus, UserRole
from app.models.listing import Listing
from app.models.user import User
from app.schemas.listing import ListingCreate, ListingOut, ListingPatch, PaginatedListings, SellerBrief

router = APIRouter()


def _listing_out(listing: Listing) -> ListingOut:
    return ListingOut(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        price=listing.price,
        currency=listing.currency,
        category=listing.category,
        images=listing.images or [],
        seller=SellerBrief(uid=listing.seller.uid, name=listing.seller.name),
        status=listing.status,
        created_at=listing.created_at,
        updated_at=listing.updated_at,
    )


@router.get("", response_model=PaginatedListings)
async def list_listings(
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    status: Optional[str] = Query("active"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    q = select(Listing)
    if status:
        q = q.where(Listing.status == status)
    if category:
        q = q.where(Listing.category == category)
    if min_price is not None:
        q = q.where(Listing.price >= min_price)
    if max_price is not None:
        q = q.where(Listing.price <= max_price)

    total_result = await db.execute(select(func.count()).select_from(q.subquery()))
    total = total_result.scalar_one()

    q = q.offset((page - 1) * limit).limit(limit)
    rows = (await db.execute(q)).scalars().all()

    return PaginatedListings(
        data=[_listing_out(r) for r in rows],
        pagination={"page": page, "limit": limit, "total": total},
    )


@router.get("/{listing_id}", response_model=ListingOut)
async def get_listing(
    listing_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    listing = await db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    return _listing_out(listing)


@router.post("", response_model=ListingOut, status_code=status.HTTP_201_CREATED)
async def create_listing(
    body: ListingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.seller, UserRole.admin)),
):
    listing = Listing(
        seller_uid=current_user.uid,
        title=body.title,
        description=body.description,
        price=body.price,
        currency=body.currency,
        category=body.category,
        images=body.images,
    )
    db.add(listing)
    await db.commit()
    await db.refresh(listing)
    return _listing_out(listing)


@router.patch("/{listing_id}", response_model=ListingOut)
async def patch_listing(
    listing_id: uuid.UUID,
    body: ListingPatch,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    listing = await db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    is_owner = listing.seller_uid == current_user.uid
    is_admin = current_user.role == UserRole.admin
    if not (is_owner or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(listing, field, value)

    await db.commit()
    await db.refresh(listing)
    return _listing_out(listing)


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    listing_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    listing = await db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    is_owner = listing.seller_uid == current_user.uid
    is_admin = current_user.role == UserRole.admin
    if not (is_owner or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    await db.delete(listing)
    await db.commit()
