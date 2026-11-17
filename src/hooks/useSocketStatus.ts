import { useSyncExternalStore } from 'react';
import { socket } from '@/services/socket';

function subscribe(callback: () => void) {
  socket.on('connect', callback);
  socket.on('disconnect', callback);
  return () => {
    socket.off('connect', callback);
    socket.off('disconnect', callback);
  };
}

// true, поки з'єднання Socket.io активне
export function useSocketStatus(): boolean {
  return useSyncExternalStore(subscribe, () => socket.connected);
}
