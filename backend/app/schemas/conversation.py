import uuid
from datetime import datetime
from typing import List

from pydantic import BaseModel


class PartyBrief(BaseModel):
    uid: str
    name: str

    model_config = {"from_attributes": True}


class ConversationOut(BaseModel):
    id: str
    listing_id: uuid.UUID
    buyer: PartyBrief
    seller: PartyBrief
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationCreate(BaseModel):
    listing_id: uuid.UUID


class ConversationCreateResponse(BaseModel):
    id: str
    cometchat_conversation_id: str
    listing_id: uuid.UUID


class ConversationPatch(BaseModel):
    status: str


class PaginatedConversations(BaseModel):
    data: List[ConversationOut]
    pagination: dict
