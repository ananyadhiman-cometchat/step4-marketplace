import uuid

from sqlalchemy import TIMESTAMP, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.models.base import Base
from app.models.enums import ConversationStatus


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    listing_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False)
    buyer_uid: Mapped[str] = mapped_column(String(64), ForeignKey("users.uid"), nullable=False)
    seller_uid: Mapped[str] = mapped_column(String(64), ForeignKey("users.uid"), nullable=False)
    status: Mapped[ConversationStatus] = mapped_column(
        Enum(ConversationStatus, name="conversationstatus"), default=ConversationStatus.open, nullable=False
    )
    created_at: Mapped[object] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), nullable=False
    )

    buyer: Mapped["User"] = relationship("User", foreign_keys=[buyer_uid], lazy="selectin")  # noqa: F821
    seller: Mapped["User"] = relationship("User", foreign_keys=[seller_uid], lazy="selectin")  # noqa: F821
    listing: Mapped["Listing"] = relationship("Listing", foreign_keys=[listing_id], lazy="selectin")  # noqa: F821
