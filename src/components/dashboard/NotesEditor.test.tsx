import { render, screen } from '@testing-library/react';
import NotesEditor from './NotesEditor';

test('редактор нотаток показує панель форматування', async () => {
  render(<NotesEditor />);
  expect(await screen.findByRole('button', { name: 'Жирний' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Курсив' })).toBeInTheDocument();
});
