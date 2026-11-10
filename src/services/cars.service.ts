import api from './api';
import type { Car, PaginatedResponse } from '@/types/api.types';
import type { CarFormData } from '@/schemas/car.schema';

export interface CarsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export const carsService = {
  getAll: async (params: CarsQuery = {}) => {
    const { data } = await api.get<PaginatedResponse<Car>>('/cars', { params });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Car>(`/cars/${id}`);
    return data;
  },
  create: async (payload: CarFormData) => {
    const { data } = await api.post<Car>('/cars', payload);
    return data;
  },
  update: async (id: number, payload: CarFormData) => {
    const { data } = await api.put<Car>(`/cars/${id}`, payload);
    return data;
  },
  remove: async (id: number) => {
    await api.delete(`/cars/${id}`);
  },
};
