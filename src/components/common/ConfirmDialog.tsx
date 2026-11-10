import { useEffect, useRef } from 'react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Нативний <dialog>: фокус, Escape та затемнення дає сам браузер.
// Замість window.confirm(): виглядає як решта застосунку й не блокує потік.
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Підтвердити',
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault(); // закриття керується станом батька
        onCancel();
      }}
      className="m-auto w-full max-w-sm rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/30 dark:bg-gray-800 dark:text-gray-100"
    >
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Скасувати
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          {confirmText}
        </Button>
      </div>
    </dialog>
  );
}
