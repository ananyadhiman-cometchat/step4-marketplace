import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel


class SellerBrief(BaseModel):
    uid: str
    name: str

    model_config = {"from_attributes": True}


class ListingOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str = ""
    price: Decimal
    currency: str
    category: str
    images: List[str]
    seller: SellerBrief
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ListingCreate(BaseModel):
    title: str
    description: str = ""
    price: Decimal
    currency: str = "USD"
    category: str
    images: List[str] = []


class ListingPatch(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    currency: Optional[str] = None
    category: Optional[str] = None
    images: Optional[List[str]] = None
    status: Optional[str] = None


class PaginatedListings(BaseModel):
    data: List[ListingOut]
    pagination: dict
