import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { fetchNextEvent } from '../../engine/eventOrchestrator';

export function TestRunner() {
  const { gameState, setCurrentEvent } = useGameStore();

  const loadNext = async () => {
    const event = await fetchNextEvent(gameState.current_age, gameState.current_stage);
    setCurrentEvent(event);
  };

  return (
    <button onClick={loadNext} className="p-4 bg-green-600 text-white rounded">
      Start Alpha Test
    </button>
  );
}
