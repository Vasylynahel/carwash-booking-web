import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { carSchema, type CarFormData, type CarFormInput } from '@/schemas/car.schema';
import { carsService } from '@/services/cars.service';
import { getErrorMessage } from '@/utils/errors';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import FormField from '@/components/common/FormField';
import Input from '@/components/common/Input';
import Skeleton from '@/components/common/Skeleton';

interface CarFormProps {
  defaultValues?: Partial<CarFormInput>;
  isSaving: boolean;
  onSubmit: (data: CarFormData) => void;
  onCancel: () => void;
}

function CarForm({ defaultValues, isSaving, onSubmit, onCancel }: CarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormInput, unknown, CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl bg-white p-6 shadow dark:bg-gray-900"
      noValidate
    >
      <FormField label="Марка" error={errors.brand?.message}>
        <Input placeholder="Toyota" {...register('brand')} />
      </FormField>
      <FormField label="Модель" error={errors.model?.message}>
        <Input placeholder="Camry" {...register('model')} />
      </FormField>
      <FormField label="Державний номер" error={errors.plate_number?.message}>
        <Input placeholder="AA1234BB" {...register('plate_number')} />
      </FormField>

      <div className="flex gap-4">
        <Button type="submit" isLoading={isSaving}>
          Зберегти
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Скасувати
        </Button>
      </div>
    </form>
  );
}

export default function CarFormPage() {
  const { id } = useParams();
  const carId = id ? Number(id) : null;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const existing = useQuery({
    queryKey: ['cars', carId],
    queryFn: () => carsService.getById(carId!),
    enabled: carId !== null,
  });

  const save = useMutation({
    mutationFn: (data: CarFormData) =>
      carId === null ? carsService.create(data) : carsService.update(carId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast.success(carId === null ? 'Автомобіль додано' : 'Зміни збережено');
      navigate('/cars');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Не вдалося зберегти')),
  });

  const title = carId === null ? 'Новий автомобіль' : 'Редагування автомобіля';

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumbs
        items={[
          { label: 'Огляд', to: '/dashboard' },
          { label: 'Мої автомобілі', to: '/cars' },
          { label: title },
        ]}
      />
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>

      {carId !== null && existing.isPending && <Skeleton className="h-56" />}
      {existing.isError && (
        <p role="alert" className="text-red-500">
          Помилка: {existing.error.message}
        </p>
      )}

      {(carId === null || existing.data) && (
        <CarForm
          defaultValues={existing.data}
          isSaving={save.isPending}
          onSubmit={(data) => save.mutate(data)}
          onCancel={() => navigate('/cars')}
        />
      )}
    </div>
  );
}
