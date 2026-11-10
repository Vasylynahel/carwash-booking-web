import { isAxiosError } from 'axios';

// Усі interceptors уже кладуть читабельний текст у error.message
export function getErrorMessage(error: unknown, fallback = 'Сталася помилка'): string {
  if (isAxiosError(error) || error instanceof Error) return error.message || fallback;
  return fallback;
}
