import { useState } from 'react';
import toast from 'react-hot-toast';
import { selectUnreadCount, useNotificationsStore } from '@/stores/notificationsStore';
import { useSocketEvent } from '@/hooks/useSocketEvent';
import { formatDateTime } from '@/utils/format';

interface NotificationPayload {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useNotificationsStore((s) => s.notifications);
  const unreadCount = useNotificationsStore(selectUnreadCount);
  const { add, markAsRead, markAllAsRead } = useNotificationsStore.getState();

  // Сервер шле 'notification' в особисту кімнату користувача (user:<id>)
  useSocketEvent<NotificationPayload>('notification', (data) => {
    add({ type: data.type ?? 'info', title: data.title ?? 'Сповіщення', message: data.message });
    toast(data.message, { icon: '🔔' });
  });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={`Сповіщення: непрочитаних ${unreadCount}`}
        aria-expanded={isOpen}
        className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <h3 className="font-semibold">Сповіщення</h3>
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-sm text-primary-600 hover:underline"
            >
              Прочитати всі
            </button>
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <li className="p-4 text-center text-gray-500">Немає сповіщень</li>
            )}
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => markAsRead(n.id)}
                  className={`block w-full border-b border-gray-100 p-4 text-left hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 ${
                    n.read ? '' : 'bg-primary-50 dark:bg-gray-800'
                  }`}
                >
                  <span className="block font-medium">{n.title}</span>
                  <span className="block text-sm text-gray-600 dark:text-gray-400">
                    {n.message}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDateTime(new Date(n.timestamp).toISOString())}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
