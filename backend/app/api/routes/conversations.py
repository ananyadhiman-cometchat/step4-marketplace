import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.conversation import Conversation
from app.models.enums import ConversationStatus, UserRole
from app.models.listing import Listing
from app.models.user import User
from app.schemas.conversation import (
    ConversationCreate,
    ConversationCreateResponse,
    ConversationOut,
    ConversationPatch,
    PaginatedConversations,
    PartyBrief,
)

router = APIRouter()


def _conv_out(conv: Conversation) -> ConversationOut:
    return ConversationOut(
        id=conv.id,
        listing_id=conv.listing_id,
        buyer=PartyBrief(uid=conv.buyer.uid, name=conv.buyer.name),
        seller=PartyBrief(uid=conv.seller.uid, name=conv.seller.name),
        status=conv.status,
        created_at=conv.created_at,
    )


@router.get("", response_model=PaginatedConversations)
async def list_conversations(
    conv_status: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = select(Conversation)

    if current_user.role in (UserRole.admin, UserRole.moderator):
        pass
    else:
        q = q.where(
            or_(Conversation.buyer_uid == current_user.uid, Conversation.seller_uid == current_user.uid)
        )

    if conv_status:
        q = q.where(Conversation.status == conv_status)

    total_result = await db.execute(select(func.count()).select_from(q.subquery()))
    total = total_result.scalar_one()

    q = q.offset((page - 1) * limit).limit(limit)
    rows = (await db.execute(q)).scalars().all()

    return PaginatedConversations(
        data=[_conv_out(r) for r in rows],
        pagination={"page": page, "limit": limit, "total": total},
    )


@router.get("/{conv_id}", response_model=ConversationOut)
async def get_conversation(
    conv_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = await db.get(Conversation, conv_id)
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    is_participant = current_user.uid in (conv.buyer_uid, conv.seller_uid)
    is_privileged = current_user.role in (UserRole.admin, UserRole.moderator)
    if not (is_participant or is_privileged):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    return _conv_out(conv)


@router.post("", response_model=ConversationCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    body: ConversationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.buyer)),
):
    listing = await db.get(Listing, body.listing_id)
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    existing = await db.execute(
        select(Conversation).where(
            Conversation.listing_id == body.listing_id,
            Conversation.buyer_uid == current_user.uid,
        )
    )
    existing_conv = existing.scalar_one_or_none()
    if existing_conv:
        return ConversationCreateResponse(
            id=existing_conv.id,
            cometchat_conversation_id=existing_conv.id,
            listing_id=existing_conv.listing_id,
        )

    conv_id = f"mkt-conv-{uuid.uuid4().hex[:12]}"
    conv = Conversation(
        id=conv_id,
        listing_id=body.listing_id,
        buyer_uid=current_user.uid,
        seller_uid=listing.seller_uid,
        status=ConversationStatus.open,
    )
    db.add(conv)
    await db.commit()

    return ConversationCreateResponse(
        id=conv.id,
        cometchat_conversation_id=conv.id,
        listing_id=conv.listing_id,
    )


@router.patch("/{conv_id}", response_model=ConversationOut)
async def patch_conversation(
    conv_id: str,
    body: ConversationPatch,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.moderator)),
):
    conv = await db.get(Conversation, conv_id)
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    conv.status = body.status
    await db.commit()
    await db.refresh(conv)
    return _conv_out(conv)
