import { useGameStore } from '../store/gameStore';
import { LIFE_EVENTS } from '../data/events';

export function useGameLoop() {
  const { gameState, incrementAge, setCurrentEvent, applyChoice } = useGameStore();

  const advanceLife = () => {
    incrementAge();
    const possibleEvents = LIFE_EVENTS.filter(e => 
      gameState.current_age >= e.ageRange[0] && gameState.current_age <= e.ageRange[1]
    );
    const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
    setCurrentEvent(randomEvent || { title: 'Quiet Year', narrative: 'The simulation remains stable. No major anomalies detected.' });
  };

  return { advanceLife };
}
