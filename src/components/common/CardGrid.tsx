import type { ReactNode } from 'react';

interface CardGridProps<T> {
  items: T[];
  getKey: (item: T) => number | string;
  renderItem: (item: T) => ReactNode;
  emptyText?: string;
}

// Адаптивна сітка: 1 колонка на телефоні, 2 на планшеті, 3 на десктопі
export default function CardGrid<T>({
  items,
  getKey,
  renderItem,
  emptyText = 'Нічого не знайдено',
}: CardGridProps<T>) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-gray-500">{emptyText}</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={getKey(item)}>{renderItem(item)}</div>
      ))}
    </div>
  );
}
