import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchSelect from './SearchSelect';

function Harness({ allowCustom = false }: { allowCustom?: boolean }) {
  const [value, setValue] = useState('');
  return (
    <>
      <SearchSelect
        aria-label="Марка"
        options={['Toyota', 'Tesla', 'Honda']}
        value={value}
        onChange={setValue}
        allowCustom={allowCustom}
      />
      <output data-testid="value">{value}</output>
    </>
  );
}

test('пошук фільтрує список, клік по варіанту обирає його', async () => {
  const user = userEvent.setup();
  render(<Harness />);
  await user.type(screen.getByRole('combobox', { name: 'Марка' }), 'to');
  expect(screen.getByRole('option', { name: 'Toyota' })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: 'Honda' })).not.toBeInTheDocument();

  await user.click(screen.getByRole('option', { name: 'Toyota' }));
  expect(screen.getByTestId('value')).toHaveTextContent('Toyota');
});

test('allowCustom пропускає власне значення', async () => {
  const user = userEvent.setup();
  render(<Harness allowCustom />);
  await user.type(screen.getByRole('combobox', { name: 'Марка' }), 'Lada');
  expect(screen.getByTestId('value')).toHaveTextContent('Lada');
});
