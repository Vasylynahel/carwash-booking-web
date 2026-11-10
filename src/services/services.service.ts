import api from './api';
import type { PaginatedResponse, Service } from '@/types/api.types';
import type { ServiceFormData } from '@/schemas/service.schema';

export interface ServicesQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Сервіс лише робить HTTP-запити; кеш і стан завантаження веде TanStack Query
export const servicesService = {
  getAll: async (params: ServicesQuery = {}) => {
    const { data } = await api.get<PaginatedResponse<Service>>('/services', { params });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Service>(`/services/${id}`);
    return data;
  },
  create: async (payload: ServiceFormData) => {
    const { data } = await api.post<Service>('/services', payload);
    return data;
  },
  update: async (id: number, payload: ServiceFormData) => {
    const { data } = await api.put<Service>(`/services/${id}`, payload);
    return data;
  },
  remove: async (id: number) => {
    await api.delete(`/services/${id}`);
  },
};
