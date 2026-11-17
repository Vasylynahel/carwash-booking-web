import { useOnlineStore } from '@/stores/onlineStore';
import { useSocketStatus } from '@/hooks/useSocketStatus';

// Зелена/сіра крапка для конкретного користувача
export function OnlineDot({ userId }: { userId: number }) {
  const online = useOnlineStore((s) => s.ids.includes(userId));
  return (
    <span
      role="img"
      aria-label={online ? 'Онлайн' : 'Офлайн'}
      title={online ? 'Онлайн' : 'Офлайн'}
      className={`inline-block h-2.5 w-2.5 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`}
    />
  );
}

// Стан власного з'єднання із сервером реального часу
export function ConnectionStatus() {
  const connected = useSocketStatus();
  return (
    <span
      className="flex items-center gap-1.5 text-xs text-gray-500"
      title="З'єднання із сервером сповіщень"
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${connected ? 'bg-green-500' : 'bg-amber-500'}`}
      />
      <span className="hidden sm:inline">{connected ? 'На зв’язку' : 'Підключення…'}</span>
    </span>
  );
}
