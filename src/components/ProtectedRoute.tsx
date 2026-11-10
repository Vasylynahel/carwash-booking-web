import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@/types/api.types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Role[];
}

// Захист на клієнті — лише зручність інтерфейсу. Справжні права перевіряє сервер.
export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!accessToken) {
    // state.from дозволяє повернути користувача на потрібну сторінку після входу
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
