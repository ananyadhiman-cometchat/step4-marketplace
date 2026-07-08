export type Role = 'admin' | 'seller' | 'buyer' | 'moderator' | 'smoke'
export type UserStatus = 'active' | 'banned' | 'pending'
export type ListingStatus = 'active' | 'sold' | 'removed'
export type ConversationStatus = 'open' | 'closed' | 'flagged'
export type MessageType = 'text' | 'image' | 'file' | 'call'
export type CallType = 'audio' | 'video'
export type CallStatus = 'initiated' | 'accepted' | 'rejected' | 'ended'

export interface AuthUser {
  uid: string
  name: string
  role: Role
  avatar_url: string | null
}

export interface AuthResponse {
  token: string
  cometchat_auth_token: string
  user: AuthUser
}

export interface User {
  uid: string
  name: string
  email: string
  role: Role
  avatar_url: string | null
  status: UserStatus
  created_at: string
}

export interface SellerSummary {
  uid: string
  name: string
}

export interface Listing {
  id: string
  seller_uid: string
  title: string
  description?: string
  price: number
  currency: string
  category: string
  images: string[]
  status: ListingStatus
  seller: SellerSummary
  created_at: string
  updated_at?: string
}

export interface Conversation {
  id: string
  listing_id: string
  buyer: SellerSummary
  seller: SellerSummary
  status: ConversationStatus
  created_at: string
  cometchat_conversation_id?: string
}

export interface Message {
  id: number
  conversation_id: string
  sender_uid: string
  text: string
  type: MessageType
  sent_at: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

export interface CreateListingInput {
  title: string
  description: string
  price: number
  currency: string
  category: string
  images: string[]
}
