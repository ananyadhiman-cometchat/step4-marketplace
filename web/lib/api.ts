import axios, { AxiosError } from 'axios'
import type { AuthResponse, Listing, CreateListingInput, PaginatedResponse, Conversation, User } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mkt_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('mkt_token')
      localStorage.removeItem('mkt_user')
      localStorage.removeItem('mkt_cc_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data?.detail === 'string') return data.detail
    if (typeof data?.message === 'string') return data.message
    return error.message
  }
  return 'An unexpected error occurred'
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/api/auth/login', { email, password }),
  health: () => apiClient.get<{ status: string; timestamp: string }>('/api/health'),
}

// Listings
export const listingsApi = {
  list: (params?: Record<string, string | number>) =>
    apiClient.get<PaginatedResponse<Listing>>('/api/listings', { params }),
  get: (id: string) => apiClient.get<Listing>(`/api/listings/${id}`),
  create: (data: CreateListingInput) => apiClient.post<Listing>('/api/listings', data),
  update: (id: string, data: Partial<CreateListingInput>) =>
    apiClient.patch<Listing>(`/api/listings/${id}`, data),
  remove: (id: string) => apiClient.delete(`/api/listings/${id}`),
}

// Conversations
export const conversationsApi = {
  list: (params?: Record<string, string | number>) =>
    apiClient.get<PaginatedResponse<Conversation>>('/api/conversations', { params }),
  get: (id: string) => apiClient.get<Conversation>(`/api/conversations/${id}`),
  create: (listing_id: string) =>
    apiClient.post<{ id: string; cometchat_conversation_id: string; listing_id: string }>(
      '/api/conversations',
      { listing_id }
    ),
  updateStatus: (id: string, status: string) =>
    apiClient.patch<Conversation>(`/api/conversations/${id}`, { status }),
}

// Users (admin)
export const usersApi = {
  list: (params?: Record<string, string | number>) =>
    apiClient.get<PaginatedResponse<User>>('/api/users', { params }),
  updateStatus: (uid: string, status: string) =>
    apiClient.patch<User>(`/api/users/${uid}`, { status }),
}
