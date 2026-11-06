import type { ComponentProps } from 'react';

export default function Card({ className = '', children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
