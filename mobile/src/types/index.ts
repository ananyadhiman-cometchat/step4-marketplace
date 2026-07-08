export type Role = 'admin' | 'seller' | 'buyer' | 'moderator' | 'smoke';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: Role;
  avatar_url: string | null;
  status: 'active' | 'banned' | 'pending';
  created_at: string;
}

export interface AuthUser {
  uid: string;
  name: string;
  role: Role;
  avatar_url: string | null;
}

export interface AuthResponse {
  token: string;
  cometchat_auth_token: string;
  user: AuthUser;
}

export interface Seller {
  uid: string;
  name: string;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  seller: Seller;
  status: 'active' | 'sold' | 'removed';
  created_at: string;
  updated_at?: string;
}

export interface CreateListingPayload {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer: AuthUser;
  seller: AuthUser;
  status: 'open' | 'closed' | 'flagged';
  created_at: string;
  cometchat_conversation_id?: string;
}

export interface Message {
  id: number;
  conversation_id: string;
  sender_uid: string;
  text: string;
  type: 'text' | 'image' | 'file' | 'call';
  sent_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export type ListingFilters = {
  category?: string;
  min_price?: number;
  max_price?: number;
  status?: string;
  page?: number;
  limit?: number;
};
