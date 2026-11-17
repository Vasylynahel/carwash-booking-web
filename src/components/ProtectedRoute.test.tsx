import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/api.types';

const client: User = {
  id: 1,
  email: 'c@example.com',
  full_name: 'Клієнт',
  phone: null,
  role: 'client',
  created_at: '2026-01-01T00:00:00Z',
};

function renderAt(roles?: ('client' | 'master' | 'admin')[]) {
  render(
    <MemoryRouter initialEntries={['/secret']}>
      <Routes>
        <Route path="/login" element={<p>Сторінка входу</p>} />
        <Route path="/dashboard" element={<p>Кабінет</p>} />
        <Route
          path="/secret"
          element={
            <ProtectedRoute roles={roles}>
              <p>Секрет</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => useAuthStore.setState({ user: null, accessToken: null }));

test('гостя перенаправляє на /login', () => {
  renderAt();
  expect(screen.getByText('Сторінка входу')).toBeInTheDocument();
});

test('авторизований користувач бачить сторінку', () => {
  useAuthStore.setState({ user: client, accessToken: 'token' });
  renderAt();
  expect(screen.getByText('Секрет')).toBeInTheDocument();
});

test('користувач без потрібної ролі потрапляє в кабінет', () => {
  useAuthStore.setState({ user: client, accessToken: 'token' });
  renderAt(['admin']);
  expect(screen.getByText('Кабінет')).toBeInTheDocument();
});
