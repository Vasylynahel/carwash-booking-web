import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationBell from './NotificationBell';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { socket } from '@/services/socket';

// Справжній сокет підміняємо мінімальним емітером подій: мережа в модульних тестах не потрібна
vi.mock('@/services/socket', () => {
  type Handler = (payload: unknown) => void;
  const handlers = new Map<string, Set<Handler>>();
  return {
    socket: {
      on: (event: string, h: Handler) =>
        handlers.set(event, (handlers.get(event) ?? new Set()).add(h)),
      off: (event: string, h: Handler) => handlers.get(event)?.delete(h),
      emit: (event: string, payload: unknown) => handlers.get(event)?.forEach((h) => h(payload)),
      count: (event: string) => handlers.get(event)?.size ?? 0,
    },
  };
});

const fake = socket as unknown as {
  emit: (e: string, p: unknown) => void;
  count: (e: string) => number;
};

beforeEach(() => useNotificationsStore.getState().clearAll());

test('подія notification збільшує лічильник, клік позначає сповіщення прочитаним', async () => {
  const user = userEvent.setup();
  render(<NotificationBell />);
  expect(screen.getByRole('button', { name: /непрочитаних 0/ })).toBeInTheDocument();

  act(() =>
    fake.emit('notification', { title: 'Запис підтверджено', message: 'Ваш візит о 10:00' })
  );
  expect(screen.getByRole('button', { name: /непрочитаних 1/ })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /Сповіщення/ }));
  await user.click(screen.getByText('Запис підтверджено'));
  expect(screen.getByRole('button', { name: /непрочитаних 0/ })).toBeInTheDocument();
});

test('при розмонтуванні компонент знімає власний обробник', () => {
  const { unmount } = render(<NotificationBell />);
  expect(fake.count('notification')).toBe(1);
  unmount();
  expect(fake.count('notification')).toBe(0);
});
