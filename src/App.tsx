import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loading from '@/components/common/Loading';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';

// Кожна lazy-сторінка потрапляє в окремий файл (chunk) і вантажиться лише за потреби.
// В основному пакеті лишається лише головна. Кабінет (із Socket.io) і форми (Zod, React Hook Form)
// вантажаться, коли користувач до них доходить.
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ServicesListPage = lazy(() => import('@/pages/ServicesListPage'));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'));
const ServiceFormPage = lazy(() => import('@/pages/ServiceFormPage'));
const ServicesFeedPage = lazy(() => import('@/pages/ServicesFeedPage'));
const CarsListPage = lazy(() => import('@/pages/CarsListPage'));
const CarFormPage = lazy(() => import('@/pages/CarFormPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Публічні сторінки із шапкою й футером */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Кабінет: усе всередині доступне лише після входу */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />

            <Route path="services" element={<ServicesListPage />} />
            <Route path="catalog" element={<ServicesFeedPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="services/create"
              element={
                <ProtectedRoute roles={['admin']}>
                  <ServiceFormPage />
                </ProtectedRoute>
              }
            />
            <Route path="services/:id" element={<ServiceDetailPage />} />
            <Route
              path="services/:id/edit"
              element={
                <ProtectedRoute roles={['admin']}>
                  <ServiceFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="cars"
              element={
                <ProtectedRoute roles={['client']}>
                  <CarsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="cars/create"
              element={
                <ProtectedRoute roles={['client']}>
                  <CarFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="cars/:id/edit"
              element={
                <ProtectedRoute roles={['client']}>
                  <CarFormPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
