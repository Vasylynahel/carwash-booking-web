import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { servicesService } from '@/services/services.service';
import { useAuthStore } from '@/stores/authStore';
import { formatDuration, formatPrice } from '@/utils/format';
import Badge from '@/components/common/Badge';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import DataList from '@/components/common/DataList';
import Skeleton from '@/components/common/Skeleton';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const serviceId = Number(id);
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['services', serviceId],
    queryFn: () => servicesService.getById(serviceId),
    enabled: Number.isInteger(serviceId),
  });

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumbs
        items={[
          { label: 'Огляд', to: '/dashboard' },
          { label: 'Послуги', to: '/services' },
          { label: data?.name ?? 'Послуга' },
        ]}
      />

      {isPending && <Skeleton className="h-48" />}
      {isError && (
        <p role="alert" className="text-red-500">
          Помилка: {error.message}
        </p>
      )}

      {data && (
        <Card>
          <div className="mb-4 flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <Badge tone={data.is_active ? 'success' : 'neutral'}>
              {data.is_active ? 'Активна' : 'Вимкнена'}
            </Badge>
          </div>
          {data.description && (
            <p className="mb-4 text-gray-600 dark:text-gray-400">{data.description}</p>
          )}
          <DataList
            items={[
              { label: 'Тривалість', value: formatDuration(data.duration_minutes) },
              { label: 'Вартість', value: formatPrice(data.price) },
            ]}
          />
          {isAdmin && (
            <Link to={`/services/${data.id}/edit`} className="mt-4 inline-block">
              <Button variant="secondary">Редагувати</Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}
