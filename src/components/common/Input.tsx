import type { ComponentProps } from 'react';

// У React 19 ref приходить звичайним пропом, тож forwardRef не потрібен.
// Це знадобиться в лабі 5 для React Hook Form (register() повертає ref).
export default function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 ${className}`}
      {...props}
    />
  );
}
