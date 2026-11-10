import { useState } from 'react';
import { Link } from 'react-router';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { carsService } from '@/services/cars.service';
import { useDebounce } from '@/hooks/useDebounce';
import { getErrorMessage } from '@/utils/errors';
import type { Car } from '@/types/api.types';
import Badge from '@/components/common/Badge';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import CardGrid from '@/components/common/CardGrid';
import Card from '@/components/common/Card';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Input from '@/components/common/Input';
import Pagination from '@/components/common/Pagination';
import { GridSkeleton } from '@/components/common/Skeleton';

export default function CarsListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<Car | null>(null);
  const debouncedSearch = useDebounce(search);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['cars', { page, search: debouncedSearch }],
    queryFn: () => carsService.getAll({ page, limit: 9, search: debouncedSearch || undefined }),
    placeholderData: keepPreviousData,
  });

  const deleteCar = useMutation({
    mutationFn: carsService.remove,
    onSuccess: async () => {
      toast.success('Автомобіль видалено');
      setToDelete(null);
      await queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Не вдалося видалити автомобіль')),
  });

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Огляд', to: '/dashboard' }, { label: 'Мої автомобілі' }]} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Мої автомобілі</h1>
        <Link to="/cars/create">
          <Button>Додати автомобіль</Button>
        </Link>
      </div>

      <Input
        aria-label="Пошук автомобілів"
        placeholder="Пошук за маркою чи номером..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="mb-4 max-w-md"
      />

      {isPending && <GridSkeleton />}
      {isError && (
        <p role="alert" className="text-red-500">
          Помилка: {error.message}
        </p>
      )}

      {data && (
        <>
          <CardGrid
            items={data.items}
            getKey={(c) => c.id}
            emptyText="Ви ще не додали жодного автомобіля"
            renderItem={(car) => (
              <Card>
                <Badge tone="info" className="mb-3 font-mono">
                  {car.plate_number}
                </Badge>
                <h2 className="mb-4 text-xl font-semibold">
                  {car.brand} {car.model}
                </h2>
                <div className="flex gap-2">
                  <Link to={`/cars/${car.id}/edit`}>
                    <Button size="sm" variant="secondary">
                      Редагувати
                    </Button>
                  </Link>
                  <Button size="sm" variant="danger" onClick={() => setToDelete(car)}>
                    Видалити
                  </Button>
                </div>
              </Card>
            )}
          />
          <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        isOpen={toDelete !== null}
        title="Видалення автомобіля"
        message={`Видалити ${toDelete?.brand} ${toDelete?.model} (${toDelete?.plate_number})?`}
        confirmText="Видалити"
        isLoading={deleteCar.isPending}
        onConfirm={() => toDelete && deleteCar.mutate(toDelete.id)}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
