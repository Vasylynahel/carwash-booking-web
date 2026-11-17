import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from './ConfirmDialog';

function setup(isOpen = true) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  render(
    <ConfirmDialog
      isOpen={isOpen}
      title="Видалення послуги"
      message="Видалити «Експрес-мийка»?"
      confirmText="Видалити"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
  return { onConfirm, onCancel };
}

test('показує заголовок і текст, коли відкритий', () => {
  setup();
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Видалення послуги')).toBeInTheDocument();
});

test('не відображається, коли закритий', () => {
  setup(false);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('кнопка підтвердження викликає onConfirm', async () => {
  const { onConfirm } = setup();
  await userEvent.click(screen.getByRole('button', { name: 'Видалити' }));
  expect(onConfirm).toHaveBeenCalledOnce();
});

test('Escape викликає onCancel', async () => {
  const { onCancel } = setup();
  await userEvent.keyboard('{Escape}');
  expect(onCancel).toHaveBeenCalled();
});
