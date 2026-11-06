import type { ComponentProps } from 'react';

interface BadgeProps extends ComponentProps<'span'> {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
}

const toneClasses = {
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  info: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100',
  success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100',
};

export default function Badge({
  tone = 'neutral',
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
