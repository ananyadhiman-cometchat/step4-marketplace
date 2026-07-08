import apiClient from './client';
import { AuthResponse } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return res.data;
}

export async function getHealth(): Promise<{ status: string; timestamp: string }> {
  const res = await apiClient.get('/health');
  return res.data;
}
