import { render, screen } from '@testing-library/react';
import SortableList from './SortableList';

test('відображає елементи списку з ручками для перетягування', () => {
  render(
    <SortableList
      items={[
        { id: 1, name: 'Мийка' },
        { id: 2, name: 'Полірування' },
      ]}
      getId={(i) => i.id}
      onReorder={() => {}}
      renderItem={(i) => <span>{i.name}</span>}
    />
  );
  expect(screen.getByText('Мийка')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: 'Перетягнути' })).toHaveLength(2);
});
