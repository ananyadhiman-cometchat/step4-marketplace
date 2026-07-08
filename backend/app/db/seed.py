"""Idempotent seed: creates tables + inserts baseline data."""
import asyncio
import uuid

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.db.session import AsyncSessionLocal, engine
from app.models.base import Base
from app.models.call import Call  # noqa: F401 — registers model
from app.models.conversation import Conversation
from app.models.enums import ConversationStatus, ListingStatus, UserRole, UserStatus
from app.models.listing import Listing
from app.models.message import Message  # noqa: F401 — registers model
from app.models.user import User

SEED_PASSWORD = "Mkt@seed2026!"

USERS = [
    {"uid": "mkt-adm-001", "name": "Alex Admin", "email": "alex.admin@mkt.io", "role": UserRole.admin},
    {"uid": "mkt-sel-001", "name": "Sara Seller", "email": "sara.seller@mkt.io", "role": UserRole.seller},
    {"uid": "mkt-buy-001", "name": "Bob Buyer", "email": "bob.buyer@mkt.io", "role": UserRole.buyer},
    {"uid": "mkt-mod-001", "name": "Maya Mod", "email": "maya.mod@mkt.io", "role": UserRole.moderator},
    {"uid": "mkt-buy-002", "name": "Carlos Buyer", "email": "carlos.buyer@mkt.io", "role": UserRole.buyer},
    {"uid": "mkt-smk-001", "name": "Smoke Bot", "email": "smoke@mkt.io", "role": UserRole.smoke},
]

SEED_LISTING_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")
SEED_CONV_ID = "mkt-conv-seed-001"


async def run():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        await _seed_users(db)
        listing = await _seed_listing(db)
        await _seed_conversation(db, listing)
        await db.commit()
    print("Seed complete.")


async def _seed_users(db: AsyncSession):
    pw_hash = hash_password(SEED_PASSWORD)
    for u in USERS:
        existing = await db.get(User, u["uid"])
        if not existing:
            db.add(User(
                uid=u["uid"],
                name=u["name"],
                email=u["email"],
                password_hash=pw_hash,
                role=u["role"],
                status=UserStatus.active,
            ))


async def _seed_listing(db: AsyncSession) -> Listing:
    existing = await db.get(Listing, SEED_LISTING_ID)
    if existing:
        return existing
    listing = Listing(
        id=SEED_LISTING_ID,
        seller_uid="mkt-sel-001",
        title="Vintage Camera",
        description="A classic film camera in excellent condition.",
        price="149.99",
        currency="USD",
        category="Electronics",
        images=[],
        status=ListingStatus.active,
    )
    db.add(listing)
    await db.flush()
    return listing


async def _seed_conversation(db: AsyncSession, listing: Listing):
    existing = await db.get(Conversation, SEED_CONV_ID)
    if existing:
        return
    db.add(Conversation(
        id=SEED_CONV_ID,
        listing_id=listing.id,
        buyer_uid="mkt-buy-001",
        seller_uid="mkt-sel-001",
        status=ConversationStatus.open,
    ))


if __name__ == "__main__":
    asyncio.run(run())
