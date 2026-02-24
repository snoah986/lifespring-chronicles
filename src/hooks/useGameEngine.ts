import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getNextEvent } from '../engine/eventEngine';

export function useGameEngine() {
  const { 
    gameState, 
    loadedEvents, 
    currentEvent, 
    eventHistory,
    applyStatDeltas,
    progressAge,
    addEventToHistory
  } = useGameStore();

  useEffect(() => {
    if (gameState && !currentEvent && loadedEvents.length > 0) {
      const next = getNextEvent(gameState, eventHistory, loadedEvents);
      if (next) {
        useGameStore.setState({ currentEvent: next });
      }
    }
  }, [gameState?.current_age, currentEvent, loadedEvents.length]);

  const processChoice = (choiceIndex: number) => {
    if (!currentEvent || !gameState) return;

    const choice = currentEvent.choices[choiceIndex];
    let finalDeltas = { ...choice.statDeltas };

    if (gameState.current_age >= 12 && gameState.current_age <= 14) {
      if (finalDeltas.happiness) finalDeltas.happiness *= 1.5;
      if (finalDeltas.mental_health) finalDeltas.mental_health *= 1.5;
    }

    if (gameState.current_age >= 13 && gameState.current_age <= 17 && finalDeltas.reputation && finalDeltas.reputation < 0) {
      finalDeltas.happiness = (finalDeltas.happiness || 0) - 10;
      finalDeltas.mental_health = (finalDeltas.mental_health || 0) - 10;
    }

    applyStatDeltas(finalDeltas);
    addEventToHistory(currentEvent, choice);
    useGameStore.setState({ currentEvent: null });
    progressAge(1);
  };

  return { processChoice };
}
