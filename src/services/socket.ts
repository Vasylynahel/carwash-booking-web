import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';

// Адреса Socket.io БЕЗ префікса /api: він належить лише REST-маршрутам.
// Інакше "/api" було б сприйнято як простір імен (namespace).
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:8000';

// Єдиний екземпляр на весь застосунок. З'єднання не встановлюється, доки немає токена,
// але підписуватися на події (socket.on) компоненти можуть у будь-який момент.
export const socket: Socket = io(SOCKET_URL, { autoConnect: false });

// Сервер відхилив токен (спливла дія або він недійсний): завершуємо сесію,
// ProtectedRoute сам поверне на /login.
socket.on('connect_error', (error) => {
  if (error.message === 'unauthorized') {
    useAuthStore.getState().logout();
  }
});

export function connectSocket(token: string) {
  if (socket.active) socket.disconnect(); // токен змінився: перепідключаємось із новим
  socket.auth = { token };
  socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}
