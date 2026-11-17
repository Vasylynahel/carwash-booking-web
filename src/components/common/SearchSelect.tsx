import { useState } from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';

interface SearchSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  allowCustom?: boolean; // дозволити значення, якого немає у списку
  'aria-label'?: string;
}

// Випадне меню з пошуком: набираєш — список фільтрується
export default function SearchSelect({
  value,
  onChange,
  options,
  placeholder,
  allowCustom = false,
  'aria-label': ariaLabel,
}: SearchSelectProps) {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = q ? options.filter((o) => o.toLowerCase().includes(q)) : options;
  const showCustom = allowCustom && q !== '' && !options.some((o) => o.toLowerCase() === q);

  return (
    <Combobox
      value={value}
      onChange={(v: string | null) => {
        onChange(v ?? '');
        setQuery('');
      }}
      onClose={() => setQuery('')}
    >
      <div className="relative">
        <ComboboxInput
          aria-label={ariaLabel}
          placeholder={placeholder}
          displayValue={(v: string) => v}
          onChange={(e) => {
            setQuery(e.target.value);
            if (allowCustom) onChange(e.target.value);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
        />
        <ComboboxOptions
          anchor="bottom start"
          className="z-50 mt-1 max-h-60 w-(--input-width) overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg empty:invisible dark:border-gray-700 dark:bg-gray-900"
        >
          {showCustom && (
            <ComboboxOption
              value={query.trim()}
              className="cursor-pointer rounded px-3 py-2 data-focus:bg-primary-50 dark:data-focus:bg-gray-800"
            >
              Використати «{query.trim()}»
            </ComboboxOption>
          )}
          {filtered.map((o) => (
            <ComboboxOption
              key={o}
              value={o}
              className="cursor-pointer rounded px-3 py-2 data-focus:bg-primary-50 data-selected:font-semibold dark:data-focus:bg-gray-800"
            >
              {o}
            </ComboboxOption>
          ))}
          {filtered.length === 0 && !showCustom && (
            <div className="px-3 py-2 text-sm text-gray-500">Нічого не знайдено</div>
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
