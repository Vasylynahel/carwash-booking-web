import { useEffect, useState } from 'react';
import api from '@/services/api';
import type { PaginatedResponse, Service } from '@/types/api.types';
import { formatDuration, formatPrice } from '@/utils/format';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';

// Запасні дані, якщо сервер ще не запущено: щоб головна не була порожньою
const demoServices: Service[] = [
  {
    id: 1,
    name: 'Мийка кузова',
    description: 'Безконтактна мийка та сушіння',
    duration_minutes: 30,
    price: 250,
    is_active: true,
  },
  {
    id: 2,
    name: 'Комплексна мийка',
    description: 'Кузов, салон, скло',
    duration_minutes: 60,
    price: 600,
    is_active: true,
  },
  {
    id: 3,
    name: 'Хімчистка салону',
    description: 'Глибоке очищення тканини та шкіри',
    duration_minutes: 180,
    price: 2500,
    is_active: true,
  },
];

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get<PaginatedResponse<Service>>('/services', { params: { limit: 3 } })
      .then(({ data }) => !cancelled && setServices(data.items))
      .catch(() => {
        if (cancelled) return;
        setServices(demoServices);
        setIsDemo(true);
      })
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-12">
      <section className="py-8 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Запис на мийку та детейлінг онлайн</h1>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Обирайте послугу, зручний час і вільний пост — без дзвінків і черг. Статус запису побачите
          одразу, як тільки майстер візьме авто в роботу.
        </p>
        <Button size="lg">Записатися</Button>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Популярні послуги</h2>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {isDemo && (
              <p role="status" className="mb-4 text-sm text-amber-600">
                Сервер поки недоступний, тому показано приклад списку послуг.
              </p>
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {services.map((s) => (
                <Card key={s.id}>
                  <Badge tone="info" className="mb-3">
                    {formatDuration(s.duration_minutes)}
                  </Badge>
                  <h3 className="mb-1 text-xl font-semibold">{s.name}</h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">{s.description}</p>
                  <p className="text-lg font-bold text-primary-600">{formatPrice(s.price)}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
