import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { uk } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import { formatDate } from '@/utils/format';
import Card from '@/components/common/Card';

// Календар для вибору дати. Минулі дні вимкнено: на них запис неможливий.
export default function DayCalendar() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  return (
    <Card className="inline-block">
      <h2 className="mb-4 text-xl font-semibold">Календар</h2>
      <DayPicker
        mode="single"
        locale={uk}
        weekStartsOn={1}
        selected={selected}
        onSelect={setSelected}
        disabled={{ before: new Date() }}
      />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {selected ? `Обрана дата: ${formatDate(selected.toISOString())}` : 'Оберіть дату'}
      </p>
    </Card>
  );
}
