import type { ReactNode } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

// Неактивні панелі не монтуються, тож важкі вкладки (графіки, редактор) вантажаться за потреби
export default function Tabs({ items }: { items: TabItem[] }) {
  return (
    <TabGroup>
      <TabList className="mb-6 flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
        {items.map((item) => (
          <Tab
            key={item.key}
            className="-mb-px border-b-2 border-transparent px-4 py-2 whitespace-nowrap text-gray-600 outline-none hover:text-primary-600 data-focus:ring-2 data-focus:ring-primary-500 data-selected:border-primary-600 data-selected:font-semibold data-selected:text-primary-600 dark:text-gray-400"
          >
            {item.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {items.map((item) => (
          <TabPanel key={item.key}>{item.content}</TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
