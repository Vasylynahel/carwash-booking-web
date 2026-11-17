import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { servicesService } from '@/services/services.service';
import { formatDuration, formatPrice } from '@/utils/format';
import Card from '@/components/common/Card';
import Skeleton from '@/components/common/Skeleton';

type Metric = 'price' | 'duration_minutes';

const METRICS: { key: Metric; label: string }[] = [
  { key: 'price', label: 'Вартість' },
  { key: 'duration_minutes', label: 'Тривалість' },
];

// Recharts важкий, тому цей компонент підключається через lazy і не потрапляє в основний пакет
export default function ServicesChart() {
  const [metric, setMetric] = useState<Metric>('price');

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['services', 'chart'],
    queryFn: () => servicesService.getAll({ limit: 50, sortBy: 'name', order: 'asc' }),
  });

  const format = (v: number) => (metric === 'price' ? formatPrice(v) : formatDuration(v));

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Послуги: порівняння</h2>
        <div className="flex gap-1" role="group" aria-label="Показник">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={metric === m.key}
              onClick={() => setMetric(m.key)}
              className={`rounded-lg px-3 py-1 text-sm ${
                metric === m.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {isPending && <Skeleton className="h-72" />}
      {isError && (
        <p role="alert" className="text-red-500">
          Помилка: {error.message}
        </p>
      )}
      {data && data.items.length === 0 && (
        <p className="py-8 text-center text-gray-500">Немає даних для графіка</p>
      )}
      {data && data.items.length > 0 && (
        <div className="text-gray-500" style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.items}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.2} />
              <XAxis dataKey="name" stroke="currentColor" tick={{ fontSize: 12 }} />
              <YAxis stroke="currentColor" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => format(Number(v))} />
              <Bar
                dataKey={metric}
                name={metric === 'price' ? 'Вартість' : 'Тривалість'}
                fill="#0891b2"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
