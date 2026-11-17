import { useEffect } from 'react';
import { APP_NAME } from '@/constants';

// Заголовок вкладки для SPA: «Сторінка — Автомийка»
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — ${APP_NAME}`;
  }, [title]);
}
