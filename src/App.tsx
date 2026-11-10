import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from '@/components/layout/Layout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import NotFoundPage from '@/pages/NotFoundPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ServicesListPage from '@/pages/ServicesListPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import ServiceFormPage from '@/pages/ServiceFormPage';
import CarsListPage from '@/pages/CarsListPage';
import CarFormPage from '@/pages/CarFormPage';

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
