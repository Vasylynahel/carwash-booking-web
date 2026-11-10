import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { APP_NAME } from '@/constants';

const links = [
  { to: '/', label: 'Головна' },
  { to: '/about', label: 'Про нас' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `hover:text-primary-600 ${isActive ? 'font-semibold text-primary-600' : ''}`;

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.accessToken !== null);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-primary-600">
          🚗 {APP_NAME}
        </Link>

        {/* Меню для великих екранів */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            {isAuthenticated ? 'Кабінет' : 'Увійти'}
          </NavLink>
          <button type="button" onClick={toggleTheme} aria-label="Перемкнути тему">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Кнопка меню для телефонів */}
        <div className="flex items-center gap-4 md:hidden">
          <button type="button" onClick={toggleTheme} aria-label="Перемкнути тему">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            aria-label="Відкрити меню"
            aria-expanded={isOpen}
            className="text-2xl"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 md:hidden dark:border-gray-800">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to={isAuthenticated ? '/dashboard' : '/login'}
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            {isAuthenticated ? 'Кабінет' : 'Увійти'}
          </NavLink>
        </div>
      )}
    </header>
  );
}
