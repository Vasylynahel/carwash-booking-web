import { useState } from 'react';
import { Link } from 'react-router';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { servicesService } from '@/services/services.service';
import { useAuthStore } from '@/stores/authStore';
import { useDebounce } from '@/hooks/useDebounce';
import { getErrorMessage } from '@/utils/errors';
import { formatDuration, formatPrice } from '@/utils/format';
import type { Service } from '@/types/api.types';
import Badge from '@/components/common/Badge';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable, { type Column } from '@/components/common/DataTable';
import Input from '@/components/common/Input';
import Pagination from '@/components/common/Pagination';
import { TableSkeleton } from '@/components/common/Skeleton';

export default function ServicesListPage() {
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const debouncedSearch = useDebounce(search);

  // Ключ містить усі параметри: зміна сторінки, пошуку чи сортування сама запускає новий запит
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['services', { page, search: debouncedSearch, sortBy, order }],
    queryFn: () =>
      servicesService.getAll({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        sortBy,
        order,
      }),
    placeholderData: keepPreviousData, // поки вантажиться наступна сторінка, лишається попередня
  });

  const deleteService = useMutation({
    mutationFn: servicesService.remove,
    onSuccess: async () => {
      toast.success('Послугу видалено');
      setToDelete(null);
      await queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Не вдалося видалити послугу')),
  });

  const handleSort = (key: string) => {
    if (key === sortBy) {
      setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setOrder('asc');
    }
    setPage(1);
  };

  const columns: Column<Service>[] = [
    {
      header: 'Назва',
      sortKey: 'name',
      cell: (s) => (
        <Link to={`/services/${s.id}`} className="font-medium text-primary-600 hover:underline">
          {s.name}
        </Link>
      ),
    },
    {
      header: 'Тривалість',
      sortKey: 'duration_minutes',
      cell: (s) => formatDuration(s.duration_minutes),
    },
    { header: 'Вартість', sortKey: 'price', cell: (s) => formatPrice(s.price) },
    {
      header: 'Статус',
      cell: (s) => (
        <Badge tone={s.is_active ? 'success' : 'neutral'}>
          {s.is_active ? 'Активна' : 'Вимкнена'}
        </Badge>
      ),
    },
  ];

  if (isAdmin) {
    columns.push({
      header: 'Дії',
      className: 'space-x-2 text-right whitespace-nowrap',
      cell: (s) => (
        <>
          <Link to={`/services/${s.id}/edit`}>
            <Button size="sm" variant="secondary">
              Редагувати
            </Button>
          </Link>
          <Button size="sm" variant="danger" onClick={() => setToDelete(s)}>
            Видалити
          </Button>
        </>
      ),
    });
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Огляд', to: '/dashboard' }, { label: 'Послуги' }]} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Послуги</h1>
        {isAdmin && (
          <Link to="/services/create">
            <Button>Додати послугу</Button>
          </Link>
        )}
      </div>

      <Input
        aria-label="Пошук послуг"
        placeholder="Пошук за назвою..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // новий пошук завжди з першої сторінки
        }}
        className="mb-4 max-w-md"
      />

      {isPending && <TableSkeleton />}
      {isError && (
        <p role="alert" className="text-red-500">
          Помилка: {error.message}
        </p>
      )}

      {data && (
        <>
          <DataTable
            columns={columns}
            rows={data.items}
            getRowKey={(s) => s.id}
            sortBy={sortBy}
            order={order}
            onSort={handleSort}
            emptyText="Послуг не знайдено"
          />
          <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        isOpen={toDelete !== null}
        title="Видалення послуги"
        message={`Видалити послугу «${toDelete?.name}»? Цю дію не можна скасувати.`}
        confirmText="Видалити"
        isLoading={deleteService.isPending}
        onConfirm={() => toDelete && deleteService.mutate(toDelete.id)}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
