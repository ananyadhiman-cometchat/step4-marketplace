import apiClient from './client';
import { Conversation, PaginatedResponse } from '../types';

export async function getConversations(params: {
  status?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedResponse<Conversation>> {
  const res = await apiClient.get<PaginatedResponse<Conversation>>('/conversations', { params });
  return res.data;
}

export async function getConversation(id: string): Promise<Conversation> {
  const res = await apiClient.get<Conversation>(`/conversations/${id}`);
  return res.data;
}

export async function createConversation(listing_id: string): Promise<{
  id: string;
  cometchat_conversation_id: string;
  listing_id: string;
}> {
  const res = await apiClient.post('/conversations', { listing_id });
  return res.data;
}

export async function updateConversation(
  id: string,
  status: 'flagged' | 'closed'
): Promise<Conversation> {
  const res = await apiClient.patch<Conversation>(`/conversations/${id}`, { status });
  return res.data;
}
