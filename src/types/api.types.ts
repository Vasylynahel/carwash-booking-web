export type Role = 'client' | 'master' | 'admin';

export type BookingStatus = 'scheduled' | 'in_progress' | 'done' | 'cancelled';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: Role;
  created_at: string;
}

export interface Car {
  id: number;
  owner_id: number;
  brand: string;
  model: string;
  plate_number: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

export interface Bay {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Booking {
  id: number;
  client_id: number;
  car_id: number;
  bay_id: number | null;
  master_id: number | null;
  scheduled_at: string;
  status: BookingStatus;
  created_at: string;
  services: Service[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AuthResponse {
  user: User;
  tokens: { accessToken: string; refreshToken: string };
}

// FastAPI віддає помилки в полі detail (рядок або масив помилок валідації)
export interface ApiError {
  detail: string | { loc: (string | number)[]; msg: string }[];
}
