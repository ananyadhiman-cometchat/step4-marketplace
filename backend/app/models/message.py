from sqlalchemy import BIGINT, TIMESTAMP, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.enums import MessageType


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True)
    conversation_id: Mapped[str] = mapped_column(String(64), ForeignKey("conversations.id"), nullable=False)
    sender_uid: Mapped[str] = mapped_column(String(64), ForeignKey("users.uid"), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    type: Mapped[MessageType] = mapped_column(Enum(MessageType, name="messagetype"), nullable=False)
    sent_at: Mapped[object] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
