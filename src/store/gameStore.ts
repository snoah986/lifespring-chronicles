import { create } from 'zustand';

export const useGameStore = create((set) => ({
  gameState: {
    current_age: 0,
    current_stage: 'INFANCY',
    name: '',
    gender: '',
    location: '',
    stats: { health: 75, happiness: 50, wealth: 50, intelligence: 50 }
  },
  currentEvent: null,
  setIdentity: (data) => set((state) => ({ 
    gameState: { ...state.gameState, ...data } 
  })),
  setCurrentEvent: (event) => set({ currentEvent: event }),
  incrementAge: () => set((state) => ({ 
    gameState: { ...state.gameState, current_age: state.gameState.current_age + 1 } 
  })),
}));
