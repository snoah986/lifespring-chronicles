import { MOCK_EVENTS } from '../lib/mockEvents';
import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
  const { gameState, setCurrentEvent } = useGameStore();
  const advanceLife = () => {
    const next = MOCK_EVENTS.find(e => e.age >= gameState.current_age);
    if (next) setCurrentEvent(next);
  };
  return { advanceLife };
}
