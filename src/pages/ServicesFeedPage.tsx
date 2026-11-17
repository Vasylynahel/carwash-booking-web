import { Link } from 'react-router';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { servicesService } from '@/services/services.service';
import { useIntersection } from '@/hooks/useIntersection';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSocketEvent } from '@/hooks/useSocketEvent';
import { formatDuration, formatPrice } from '@/utils/format';
import Badge from '@/components/common/Badge';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Card from '@/components/common/Card';
import { GridSkeleton } from '@/components/common/Skeleton';

// Каталог з нескінченним прокручуванням: наступна порція вантажиться, коли сторож у кінці списку
// з'являється на екрані.
export default function ServicesFeedPage() {
  usePageTitle('Каталог послуг');
  const queryClient = useQueryClient();

  const { data, isPending, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['services', 'feed'],
      queryFn: ({ pageParam }) => servicesService.getAll({ page: pageParam, limit: 6 }),
      initialPageParam: 1,
      getNextPageParam: (last) => (last.page < last.pages ? last.page + 1 : undefined),
    });

  // Нова послуга чи зміна ціни на сервері: перезавантажуємо стрічку
  useSocketEvent('services:changed', () =>
    queryClient.invalidateQueries({ queryKey: ['services'] })
  );

  const sentinel = useIntersection<HTMLDivElement>(
    () => void fetchNextPage(),
    Boolean(hasNextPage) && !isFetchingNextPage
  );

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Огляд', to: '/dashboard' }, { label: 'Каталог' }]} />
      <h1 className="mb-6 text-3xl font-bold">Каталог послуг</h1>

      {isPending && <GridSkeleton />}
      {isError && (
        <p role="alert" className="text-red-500">
          Помилка: {error.message}
        </p>
      )}

      {data && items.length === 0 && <p className="py-8 text-center text-gray-500">Послуг немає</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <Link key={s.id} to={`/services/${s.id}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">{s.name}</h2>
                <Badge tone="info">{formatPrice(s.price)}</Badge>
              </div>
              {s.description && (
                <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {s.description}
                </p>
              )}
              <p className="text-sm text-gray-500">≈ {formatDuration(s.duration_minutes)}</p>
            </Card>
          </Link>
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="mt-4">
          <GridSkeleton items={3} />
        </div>
      )}
      <div ref={sentinel} aria-hidden="true" className="h-1" />
      {data && !hasNextPage && items.length > 0 && (
        <p className="mt-6 text-center text-sm text-gray-500">Це всі послуги</p>
      )}
    </div>
  );
}
