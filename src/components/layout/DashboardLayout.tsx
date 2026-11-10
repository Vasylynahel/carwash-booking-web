import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { APP_NAME } from '@/constants';
import type { Role } from '@/types/api.types';
import Button from '@/components/common/Button';
import ErrorBoundary from '@/components/ErrorBoundary';

interface NavItem {
  to: string;
  label: string;
  roles?: Role[]; // без roles — бачать усі
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Огляд' },
  { to: '/cars', label: 'Мої автомобілі', roles: ['client'] },
  { to: '/services', label: 'Послуги' },
];

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleItems = navItems.filter((i) => !i.roles || (user && i.roles.includes(user.role)));

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Бічна панель: на телефоні висувається поверх контенту */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white p-4 transition-transform md:static md:translate-x-0 dark:border-gray-800 dark:bg-gray-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <p className="mb-6 text-xl font-bold text-primary-600">🚗 {APP_NAME}</p>
        <nav className="flex flex-col gap-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  isActive ? 'bg-primary-50 font-semibold text-primary-700 dark:bg-gray-800' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Закрити меню"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <button
            type="button"
            className="text-2xl md:hidden"
            aria-label="Відкрити меню"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((o) => !o)}
          >
            ☰
          </button>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 sm:inline">{user?.full_name}</span>
            <button type="button" onClick={toggleTheme} aria-label="Перемкнути тему">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Button size="sm" variant="secondary" onClick={handleLogout}>
              Вийти
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
