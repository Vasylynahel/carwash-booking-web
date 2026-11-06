import { APP_NAME } from '@/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">
      <p>
        © {new Date().getFullYear()} {APP_NAME}. Щодня з 8:00 до 21:00
      </p>
      <p className="mt-1">Тел.: +380 00 000 00 00 · Ел. пошта: info@carwash.example</p>
    </footer>
  );
}
