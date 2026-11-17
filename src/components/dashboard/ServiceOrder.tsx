import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { servicesService } from '@/services/services.service';
import { usePreferencesStore } from '@/stores/preferencesStore';
import { formatDuration, formatPrice } from '@/utils/format';
import type { Service } from '@/types/api.types';
import Card from '@/components/common/Card';
import SortableList from '@/components/common/SortableList';
import Skeleton from '@/components/common/Skeleton';

// Власний порядок послуг: перетягніть за ручку (або Пробіл + стрілки). Зберігається на пристрої.
export default function ServiceOrder() {
  const order = usePreferencesStore((s) => s.serviceOrder);
  const setOrder = usePreferencesStore((s) => s.setServiceOrder);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['services', 'order'],
    queryFn: () => servicesService.getAll({ limit: 50, sortBy: 'name', order: 'asc' }),
  });

  const sorted: Service[] = data
    ? [...data.items].sort((a, b) => {
        const ia = order.indexOf(a.id);
        const ib = order.indexOf(b.id);
        // послуги, яких немає у збереженому порядку, йдуть у кінець
        return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
      })
    : [];

  return (
    <Card>
      <h2 className="mb-1 text-xl font-semibold">Мій порядок послуг</h2>
      <p className="mb-4 text-sm text-gray-500">
        Розташуйте послуги так, як вам зручно. Порядок зберігається на цьому пристрої.
      </p>

      {isPending && <Skeleton className="h-40" />}
      {isError && (
        <p role="alert" className="text-red-500">
          Помилка: {error.message}
        </p>
      )}
      {data && sorted.length === 0 && <p className="text-gray-500">Послуг ще немає</p>}
      {data && sorted.length > 0 && (
        <SortableList
          items={sorted}
          getId={(s) => s.id}
          onReorder={(items) => setOrder(items.map((s) => s.id))}
          renderItem={(s) => (
            <div className="flex items-center justify-between gap-3">
              <Link to={`/services/${s.id}`} className="font-medium hover:text-primary-600">
                {s.name}
              </Link>
              <span className="text-sm whitespace-nowrap text-gray-500">
                {formatDuration(s.duration_minutes)} · {formatPrice(s.price)}
              </span>
            </div>
          )}
        />
      )}
    </Card>
  );
}
