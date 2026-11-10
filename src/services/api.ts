import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { parseApiError } from '@/utils/format';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// Перехоплювач запиту: токен беремо зі сховища Zustand
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехоплювач відповіді: при 401 завершуємо сесію (ProtectedRoute сам поверне на /login),
// а решту помилок перетворюємо на зрозумілий текст.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      error.message = error.response
        ? parseApiError(error.response.data?.detail)
        : 'Немає зв’язку із сервером';
    }
    return Promise.reject(error);
  }
);

export default api;
