import { useGameStore } from '../store/gameStore';
import { NARRATIVE_EVENTS } from '../data/activities';

export function useGameLoop() {
  const { gameState, incrementAge, setCurrentEvent } = useGameStore();

  const advanceLife = () => {
    const nextAge = gameState.current_age + 1;
    incrementAge();
    const event = NARRATIVE_EVENTS[nextAge];
    setCurrentEvent(event || { 
      title: `Year ${nextAge}`, 
      narrative: 'The timeline continues without major external interference.',
      choices: [{ text: 'Continue', effects: { focus: 1 } }]
    });
  };

  return { advanceLife };
}
