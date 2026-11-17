import { create } from 'zustand';

interface OnlineState {
  ids: number[];
  setAll: (ids: number[]) => void;
  setOnline: (id: number) => void;
  setOffline: (id: number) => void;
}

// Хто зараз онлайн: сервер шле початковий список і події про підключення/відключення
export const useOnlineStore = create<OnlineState>((set) => ({
  ids: [],
  setAll: (ids) => set({ ids }),
  setOnline: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
  setOffline: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
}));
