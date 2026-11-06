import type { BookingStatus } from '@/types/api.types';

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Автомийка';

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  scheduled: 'Заплановано',
  in_progress: 'У роботі',
  done: 'Виконано',
  cancelled: 'Скасовано',
};
