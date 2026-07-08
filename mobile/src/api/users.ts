import apiClient from './client';
import { User, PaginatedResponse } from '../types';

export async function getUsers(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<User>> {
  const res = await apiClient.get<PaginatedResponse<User>>('/users', { params });
  return res.data;
}

export async function updateUser(uid: string, status: 'active' | 'banned'): Promise<User> {
  const res = await apiClient.patch<User>(`/users/${uid}`, { status });
  return res.data;
}
