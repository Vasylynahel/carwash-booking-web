import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <p className="mb-2 text-6xl font-bold text-primary-600">404</p>
      <h1 className="mb-4 text-2xl font-semibold">Сторінку не знайдено</h1>
      <Link to="/" className="text-primary-600 hover:underline">
        Повернутися на головну
      </Link>
    </div>
  );
}
