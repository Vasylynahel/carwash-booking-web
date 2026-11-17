import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { connectSocket, disconnectSocket } from '@/services/socket';

// Викликається ОДИН раз (у DashboardLayout): з'єднання належить застосунку, а не компоненту.
// Вхід відкриває з'єднання, вихід закриває.
export function useSocketConnection() {
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) return;
    connectSocket(token);
    return disconnectSocket;
  }, [token]);
}
