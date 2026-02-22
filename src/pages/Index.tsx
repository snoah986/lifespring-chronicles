import { useState, useCallback } from 'react';
import StartScreen from '@/components/game/StartScreen';
import TopBar from '@/components/game/TopBar';
import StatsPanel from '@/components/game/StatsPanel';
import EventFeed from '@/components/game/EventFeed';
import Chronicle from '@/components/game/Chronicle';
import DeathScreen from '@/components/game/DeathScreen';
import { createInitialState, selectEventForAge, applyChoice, advanceYear } from '@/game/engine';
import type { GameState, EventChoice } from '@/game/types';

const Index = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = useCallback((name: string) => {
    let state = createInitialState(name);
    state = selectEventForAge(state);
    setGameState(state);
  }, []);

  const handleChoice = useCallback((choice: EventChoice) => {
    setGameState(prev => prev ? applyChoice(prev, choice) : prev);
  }, []);

  const handleAdvanceYear = useCallback(() => {
    setGameState(prev => prev ? advanceYear(prev) : prev);
  }, []);

  const handleRestart = useCallback(() => {
    setGameState(null);
  }, []);

  // Start screen
  if (!gameState) {
    return <StartScreen onStart={handleStart} />;
  }

  // Death screen
  if (gameState.phase === 'dead') {
    return <DeathScreen state={gameState} onRestart={handleRestart} />;
  }

  // Main game
  return (
    <div className="game-grid">
      <TopBar
        state={gameState}
        onAdvanceYear={handleAdvanceYear}
        canAdvance={!gameState.currentEvent}
      />
      <StatsPanel state={gameState} />
      <EventFeed
        currentEvent={gameState.currentEvent}
        onChoice={handleChoice}
      />
      <Chronicle entries={gameState.chronicle} />
    </div>
  );
};

export default Index;
