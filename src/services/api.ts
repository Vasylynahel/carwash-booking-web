import axios from 'axios';
import { parseApiError } from '@/utils/format';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// Перехоплювач запиту: підставляє токен, якщо він є.
// У лабі 5 сховище токена переїде в стан застосунку (Zustand).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехоплювач відповіді: при 401 чистимо токен і ведемо на вхід,
// а решту помилок приводимо до зрозумілого тексту.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        if (window.location.pathname !== '/login') window.location.href = '/login';
      }
      error.message = error.response
        ? parseApiError(error.response.data?.detail)
        : 'Немає зв’язку із сервером';
    }
    return Promise.reject(error);
  }
);

export default api;
