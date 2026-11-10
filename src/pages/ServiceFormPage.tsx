import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  serviceSchema,
  type ServiceFormData,
  type ServiceFormInput,
} from '@/schemas/service.schema';
import { servicesService } from '@/services/services.service';
import { getErrorMessage } from '@/utils/errors';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import FormField from '@/components/common/FormField';
import Input from '@/components/common/Input';
import Skeleton from '@/components/common/Skeleton';

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormInput>;
  isSaving: boolean;
  onSubmit: (data: ServiceFormData) => void;
  onCancel: () => void;
}

// Три типи useForm: вхід форми, контекст (не потрібен) і вихід після перетворень Zod
function ServiceForm({ defaultValues, isSaving, onSubmit, onCancel }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormInput, unknown, ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl bg-white p-6 shadow dark:bg-gray-900"
      noValidate
    >
      <FormField label="Назва" error={errors.name?.message}>
        <Input placeholder="Комплексна мийка" {...register('name')} />
      </FormField>
      <FormField label="Опис (необов’язково)" error={errors.description?.message}>
        <Input {...register('description')} />
      </FormField>
      <FormField label="Тривалість, хв" error={errors.duration_minutes?.message}>
        <Input type="number" placeholder="60" {...register('duration_minutes')} />
      </FormField>
      <FormField label="Вартість, грн" error={errors.price?.message}>
        <Input type="number" step="0.01" placeholder="600" {...register('price')} />
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

// Одна сторінка і для створення (/services/create), і для редагування (/services/:id/edit)
export default function ServiceFormPage() {
  const { id } = useParams();
  const serviceId = id ? Number(id) : null;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const existing = useQuery({
    queryKey: ['services', serviceId],
    queryFn: () => servicesService.getById(serviceId!),
    enabled: serviceId !== null,
  });

  const save = useMutation({
    mutationFn: (data: ServiceFormData) =>
      serviceId === null ? servicesService.create(data) : servicesService.update(serviceId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(serviceId === null ? 'Послугу створено' : 'Зміни збережено');
      navigate('/services');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Не вдалося зберегти')),
  });

  const title = serviceId === null ? 'Нова послуга' : 'Редагування послуги';

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumbs
        items={[
          { label: 'Огляд', to: '/dashboard' },
          { label: 'Послуги', to: '/services' },
          { label: title },
        ]}
      />
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>

      {serviceId !== null && existing.isPending && <Skeleton className="h-64" />}
      {existing.isError && (
        <p role="alert" className="text-red-500">
          Помилка: {existing.error.message}
        </p>
      )}

      {/* Форму монтуємо, коли дані вже є: так defaultValues одразу правильні без reset() */}
      {(serviceId === null || existing.data) && (
        <ServiceForm
          defaultValues={existing.data}
          isSaving={save.isPending}
          onSubmit={(data) => save.mutate(data)}
          onCancel={() => navigate('/services')}
        />
      )}
    </div>
  );
}
