import { create } from 'zustand';

interface AppState {
  count: number;
  increaseCount: () => void;
  decreaseCount: () => void;
  resetCount: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increaseCount: () => set((state) => ({ count: state.count + 1 })),
  decreaseCount: () => set((state) => ({ count: state.count - 1 })),
  resetCount: () => set({ count: 0 }),
}));
