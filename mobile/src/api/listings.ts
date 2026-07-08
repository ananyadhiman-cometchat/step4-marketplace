import apiClient from './client';
import { Listing, CreateListingPayload, PaginatedResponse, ListingFilters } from '../types';

export async function getListings(filters: ListingFilters = {}): Promise<PaginatedResponse<Listing>> {
  const res = await apiClient.get<PaginatedResponse<Listing>>('/listings', { params: filters });
  return res.data;
}

export async function getListing(id: string): Promise<Listing> {
  const res = await apiClient.get<Listing>(`/listings/${id}`);
  return res.data;
}

export async function createListing(payload: CreateListingPayload): Promise<Listing> {
  const res = await apiClient.post<Listing>('/listings', payload);
  return res.data;
}

export async function updateListing(id: string, payload: Partial<CreateListingPayload>): Promise<Listing> {
  const res = await apiClient.patch<Listing>(`/listings/${id}`, payload);
  return res.data;
}

export async function deleteListing(id: string): Promise<void> {
  await apiClient.delete(`/listings/${id}`);
}
