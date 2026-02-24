import { create } from 'zustand';

export const useGameStore = create((set) => ({
  calendar: [],
  archive: [],
  debtAnchor: 0,
  addKeepsake: (item) => set((state) => ({ archive: [...state.archive, item] })),
  updateCalendar: (blocks) => set({ calendar: blocks }),
  applyEndOfYear: () => set((state) => ({ 
    wealth: state.wealth - state.debtAnchor * 0.05 
  })),
}));
