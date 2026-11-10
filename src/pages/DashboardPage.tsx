import { Link } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@/types/api.types';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';

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
] satisfies { to: string; title: string; text: string; roles: Role[] }[];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">Вітаємо, {user.full_name}!</h1>
        <Badge tone="info">{ROLE_LABELS[user.role]}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sections
          .filter((s) => (s.roles as Role[]).includes(user.role))
          .map((s) => (
            <Link key={s.to} to={s.to}>
              <Card className="transition-shadow hover:shadow-lg">
                <h2 className="mb-2 text-xl font-semibold">{s.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{s.text}</p>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
