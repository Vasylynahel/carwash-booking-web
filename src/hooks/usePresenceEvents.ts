import { useOnlineStore } from '@/stores/onlineStore';
import { useSocketEvent } from './useSocketEvent';

// Підписується на події присутності: початковий список і підключення/відключення користувачів.
// Викликається один раз (у DashboardLayout).
export function usePresenceEvents() {
  const { setAll, setOnline, setOffline } = useOnlineStore.getState();
  useSocketEvent<number[]>('presence:list', setAll);
  useSocketEvent<number>('user:online', setOnline);
  useSocketEvent<number>('user:offline', setOffline);
}
