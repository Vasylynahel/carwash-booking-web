import type { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  // Якщо задано — заголовок клікабельний і сортує за цим полем на сервері
  sortKey?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => number | string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  onSort?: (sortKey: string) => void;
  emptyText?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  sortBy,
  order,
  onSort,
  emptyText = 'Нічого не знайдено',
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((col) => {
              const isSorted = col.sortKey !== undefined && col.sortKey === sortBy;
              return (
                <th
                  key={col.header}
                  aria-sort={isSorted ? (order === 'asc' ? 'ascending' : 'descending') : undefined}
                  className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500"
                >
                  {col.sortKey && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(col.sortKey!)}
                      className="inline-flex items-center gap-1 uppercase hover:text-primary-600"
                    >
                      {col.header}
                      <span aria-hidden="true">
                        {isSorted ? (order === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                {emptyText}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 ${col.className ?? ''}`}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
