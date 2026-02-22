import { useState, useCallback } from 'react';

export interface GameState {
  character: {
    age: number;
    stats: {
      intelligence: number;
      reputation: number;
      health: number;
      happiness: number;
    };
    academicPerformance?: number;
    job?: {
      title: string;
      salary: number;
      tier: string;
    };
  } | null;
  countryConfig: any;
  npcs: any[];
  events: any[];
}

export const useGameState = () => {
  const [state, setState] = useState<GameState>({
    character: null,
    countryConfig: null,
    npcs: [],
    events: []
  });

  const dispatch = useCallback((action: any) => {
    switch (action.type) {
      case 'SET_JOB':
        setState(prev => ({
          ...prev,
          character: prev.character ? {
            ...prev.character,
            job: action.payload
          } : null
        }));
        break;
      case 'QUIT_JOB':
        setState(prev => ({
          ...prev,
          character: prev.character ? {
            ...prev.character,
            job: undefined
          } : null
        }));
        break;
      default:
        break;
    }
  }, []);

  return { state, dispatch };
};

