import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  serviceOrder: number[]; // власний порядок послуг (id)
  notes: string; // нотатки з редактора (HTML)
  setServiceOrder: (ids: number[]) => void;
  setNotes: (html: string) => void;
}

// Особисті налаштування лишаються на цьому пристрої (localStorage), на сервер не йдуть
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      serviceOrder: [],
      notes: '',
      setServiceOrder: (serviceOrder) => set({ serviceOrder }),
      setNotes: (notes) => set({ notes }),
    }),
    { name: 'preferences-storage' }
  )
);
