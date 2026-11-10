import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import {
  registerSchema,
  type RegisterFormData,
  type RegisterFormInput,
} from '@/schemas/auth.schema';
import api from '@/services/api';
import { getErrorMessage } from '@/utils/errors';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import FormField from '@/components/common/FormField';

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput, unknown, RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async ({ full_name, email, phone, password }: RegisterFormData) => {
    try {
      // confirmPassword існує лише для перевірки на клієнті — на сервер не йде
      await api.post('/auth/register', { full_name, email, phone, password });
      toast.success('Обліковий запис створено. Тепер увійдіть.');
      navigate('/login');
    } catch (error) {
      setError('root', { message: getErrorMessage(error, 'Не вдалося зареєструватися') });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900">
        <h1 className="mb-6 text-center text-3xl font-bold">Реєстрація</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Ім’я" error={errors.full_name?.message}>
            <Input placeholder="Іван Петренко" {...register('full_name')} />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" {...register('email')} />
          </FormField>
          <FormField label="Телефон (необов’язково)" error={errors.phone?.message}>
            <Input placeholder="+380501234567" {...register('phone')} />
          </FormField>
          <FormField label="Пароль" error={errors.password?.message}>
            <Input type="password" {...register('password')} />
          </FormField>
          <FormField label="Підтвердження пароля" error={errors.confirmPassword?.message}>
            <Input type="password" {...register('confirmPassword')} />
          </FormField>

          {errors.root && (
            <p role="alert" className="text-sm text-red-500">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Зареєструватися
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Вже є акаунт?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
