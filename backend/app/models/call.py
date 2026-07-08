from typing import Optional

from sqlalchemy import TIMESTAMP, Enum, ForeignKey, INT, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.enums import CallStatus, CallType


class Call(Base):
    __tablename__ = "calls"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    conversation_id: Mapped[str] = mapped_column(String(64), ForeignKey("conversations.id"), nullable=False)
    initiator_uid: Mapped[str] = mapped_column(String(64), ForeignKey("users.uid"), nullable=False)
    receiver_uid: Mapped[str] = mapped_column(String(64), ForeignKey("users.uid"), nullable=False)
    type: Mapped[CallType] = mapped_column(Enum(CallType, name="calltype"), nullable=False)
    status: Mapped[CallStatus] = mapped_column(Enum(CallStatus, name="callstatus"), nullable=False)
    started_at: Mapped[object] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    ended_at: Mapped[Optional[object]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    duration_seconds: Mapped[Optional[int]] = mapped_column(INT, nullable=True)
