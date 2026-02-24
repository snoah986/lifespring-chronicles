import { create } from 'zustand';

export const useGameStore = create((set) => ({
  gameState: {
    current_age: 0,
    current_stage: 'INFANCY',
    name: '', gender: '', location: '',
    stats: {
      health: 80, happiness: 60, wealth: 100, intelligence: 70,
      fitness: 50, social: 50, influence: 10, syndicate_debt: 0,
      academic: 0, criminal: 0, stress: 20, focus: 100
    }
  },
  currentEvent: null,
  activeTab: 'STORY', // STORY, ACADEMY, STADIUM, HUSTLE, NETWORK
  setIdentity: (data) => set((state) => ({ gameState: { ...state.gameState, ...data } })),
  setTab: (tab) => set({ activeTab: tab }),
  setCurrentEvent: (event) => set({ currentEvent: event }),
  applyChoice: (effects) => set((state) => {
    const newStats = { ...state.gameState.stats };
    Object.keys(effects).forEach(key => { newStats[key] += effects[key]; });
    return { gameState: { ...state.gameState, stats: newStats }, currentEvent: null };
  }),
  incrementAge: () => set((state) => ({ 
    gameState: { ...state.gameState, current_age: state.gameState.current_age + 1 } 
  })),
}));
