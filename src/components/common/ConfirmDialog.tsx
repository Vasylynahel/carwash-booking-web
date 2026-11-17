import Modal from './Modal';
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

// Заміна window.confirm(): доступний з клавіатури, у стилі застосунку, не блокує потік.
// Побудований на Modal (Headless UI), тому фокус і Escape обробляє бібліотека.
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Підтвердити',
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p className="mb-6 text-gray-600 dark:text-gray-300">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Скасувати
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
