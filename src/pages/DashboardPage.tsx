import { lazy, Suspense } from 'react';
import { Link } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { useOnlineStore } from '@/stores/onlineStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { Role } from '@/types/api.types';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import Tabs from '@/components/common/Tabs';

// Важкі вкладки (графіки, редактор, календар, dnd) вантажаться окремими файлами лише за потреби
const ServicesChart = lazy(() => import('@/components/dashboard/ServicesChart'));
const ServiceOrder = lazy(() => import('@/components/dashboard/ServiceOrder'));
const DayCalendar = lazy(() => import('@/components/dashboard/DayCalendar'));
const NotesEditor = lazy(() => import('@/components/dashboard/NotesEditor'));

const ROLE_LABELS: Record<Role, string> = {
  client: 'Клієнт',
  master: 'Майстер',
  admin: 'Адміністратор',
};

const sections = [
  {
    to: '/cars',
    title: 'Мої автомобілі',
    text: 'Додайте авто, щоб записуватись на послуги',
    roles: ['client'],
  },
  {
    to: '/services',
    title: 'Послуги',
    text: 'Перелік послуг, тривалість і вартість',
    roles: ['client', 'master', 'admin'],
  },
  {
    to: '/catalog',
    title: 'Каталог',
    text: 'Усі послуги однією стрічкою',
    roles: ['client', 'master', 'admin'],
  },
] satisfies { to: string; title: string; text: string; roles: Role[] }[];

export default function DashboardPage() {
  usePageTitle('Огляд');
  const user = useAuthStore((s) => s.user);
  const onlineCount = useOnlineStore((s) => s.ids.length);
  if (!user) return null;

  const overview = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {sections
          .filter((s) => (s.roles as Role[]).includes(user.role))
          .map((s) => (
            <Link key={s.to} to={s.to}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <h2 className="mb-2 text-xl font-semibold">{s.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{s.text}</p>
              </Card>
            </Link>
          ))}
      </div>
      {user.role === 'admin' && (
        <Card>
          <p className="text-gray-600 dark:text-gray-400">
            Зараз у системі онлайн: <span className="font-semibold">{onlineCount}</span>
          </p>
        </Card>
      )}
      <ServicesChart />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">Вітаємо, {user.full_name}!</h1>
        <Badge tone="info">{ROLE_LABELS[user.role]}</Badge>
      </div>

      <Suspense fallback={<Loading />}>
        <Tabs
          items={[
            { key: 'overview', label: 'Огляд', content: overview },
            { key: 'order', label: 'Порядок послуг', content: <ServiceOrder /> },
            { key: 'calendar', label: 'Календар', content: <DayCalendar /> },
            { key: 'notes', label: 'Нотатки', content: <NotesEditor /> },
          ]}
        />
      </Suspense>
    </div>
  );
}
