import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    seller = "seller"
    buyer = "buyer"
    moderator = "moderator"
    smoke = "smoke"


class UserStatus(str, enum.Enum):
    active = "active"
    banned = "banned"
    pending = "pending"


class ListingStatus(str, enum.Enum):
    active = "active"
    sold = "sold"
    removed = "removed"


class ConversationStatus(str, enum.Enum):
    open = "open"
    closed = "closed"
    flagged = "flagged"


class MessageType(str, enum.Enum):
    text = "text"
    image = "image"
    file = "file"
    call = "call"


class CallType(str, enum.Enum):
    audio = "audio"
    video = "video"


class CallStatus(str, enum.Enum):
    initiated = "initiated"
    accepted = "accepted"
    rejected = "rejected"
    ended = "ended"
