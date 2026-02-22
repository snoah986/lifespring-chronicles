import { useContext } from 'react';

// Create a safe default context
const defaultContext = {
  state: {
    character: null,
    countryConfig: null,
    npcs: [],
    events: []
  },
  dispatch: () => {}
};

// Try to import context, fall back to default if fails
let GameContext: any;
try {
  GameContext = require('@/context/GameContext').GameContext;
} catch {
  GameContext = { Provider: ({children}: any) => children, Consumer: () => null };
}

export const useGameState = () => {
  try {
    const context = useContext(GameContext);
    if (!context) {
      return defaultContext;
    }
    return context;
  } catch (error) {
    console.error('useGameState error:', error);
    return defaultContext;
  }
};
