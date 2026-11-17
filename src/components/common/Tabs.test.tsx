import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from './Tabs';

test('перемикає вкладки й монтує лише активну панель', async () => {
  render(
    <Tabs
      items={[
        { key: 'a', label: 'Перша', content: <p>Вміст першої</p> },
        { key: 'b', label: 'Друга', content: <p>Вміст другої</p> },
      ]}
    />
  );
  expect(screen.getByText('Вміст першої')).toBeInTheDocument();
  expect(screen.queryByText('Вміст другої')).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole('tab', { name: 'Друга' }));
  expect(screen.getByText('Вміст другої')).toBeInTheDocument();
  expect(screen.queryByText('Вміст першої')).not.toBeInTheDocument();
});
