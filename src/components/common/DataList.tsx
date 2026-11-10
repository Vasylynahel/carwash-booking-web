import type { ReactNode } from 'react';

interface DataListProps {
  items: { label: string; value: ReactNode }[];
}

// Список «назва — значення» для сторінок перегляду запису
export default function DataList({ items }: DataListProps) {
  return (
    <dl className="divide-y divide-gray-200 dark:divide-gray-800">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between gap-4 py-3">
          <dt className="text-gray-500">{item.label}</dt>
          <dd className="text-right font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
