import type { ReactNode } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

// Headless UI дає фокус-пастку, Escape, блокування прокручування, портал і ARIA-атрибути.
// Атрибут transition вмикає анімацію, а стани data-closed описані класами Tailwind.
export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} transition className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-closed:opacity-0"
      />
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        <DialogPanel
          transition
          className={`w-full ${sizeClasses[size]} rounded-xl bg-white p-6 text-gray-900 shadow-xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0 dark:bg-gray-800 dark:text-gray-100`}
        >
          <DialogTitle className="mb-4 text-xl font-bold">{title}</DialogTitle>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
