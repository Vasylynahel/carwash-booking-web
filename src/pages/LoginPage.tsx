import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
import type { AuthResponse } from '@/types/api.types';
import { getErrorMessage } from '@/utils/errors';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import FormField from '@/components/common/FormField';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.accessToken !== null);
  // Куди повернути користувача після входу (його зберіг ProtectedRoute)
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  if (isAuthenticated) return <Navigate to={from} replace />;

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { data: res } = await api.post<AuthResponse>('/auth/login', data);
      login(res.user, res.tokens.access_token);
      navigate(from, { replace: true });
    } catch (error) {
      setError('root', { message: getErrorMessage(error, 'Не вдалося увійти') });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900">
        <h1 className="mb-6 text-center text-3xl font-bold">Вхід</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="you@example.com" {...register('email')} />
          </FormField>
          <FormField label="Пароль" error={errors.password?.message}>
            <Input type="password" placeholder="••••••••" {...register('password')} />
          </FormField>

          {errors.root && (
            <p role="alert" className="text-sm text-red-500">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Увійти
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Ще немає акаунта?{' '}
          <Link to="/register" className="text-primary-600 hover:underline">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}
