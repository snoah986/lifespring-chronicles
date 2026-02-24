import React from 'react';
import { useGameStore } from '../store/gameStore';
import { StatBar } from '../components/game/StatBar';
import { EventCard } from '../components/game/EventCard';

export function Game() {
  const { gameState, currentEvent, applyStatDeltas, progressAge } = useGameStore();

  const handleChoice = (choiceIndex: number) => {
    if (currentEvent && currentEvent.choices[choiceIndex].statDeltas) {
      applyStatDeltas(currentEvent.choices[choiceIndex].statDeltas!);
      progressAge(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f5f5f0] flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-[#1a1a1c] border-r border-[#3a3a3d] p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="text-center pb-4 border-b border-[#3a3a3d]">
          <h2 className="text-xl font-mono text-[#b8b8a8]">Age: {gameState?.current_age || 0}</h2>
          <span className="text-sm text-[#f4b8a8] uppercase tracking-wider">Stage {gameState?.current_stage || 0}</span>
        </div>
        <div className="flex flex-col gap-2">
          <StatBar statName="Health" value={gameState?.stats.health || 75} color="bg-red-500" />
          <StatBar statName="Happiness" value={gameState?.stats.happiness || 50} color="bg-yellow-500" />
          <StatBar statName="Wealth" value={gameState?.stats.wealth || 50} color="bg-green-500" />
          <StatBar statName="Intelligence" value={gameState?.stats.intelligence || 50} color="bg-blue-500" />
        </div>
      </aside>
      
      <main className="flex-1 p-6 md:p-12 flex items-center justify-center">
        {currentEvent ? (
          <EventCard 
            event={currentEvent} 
            currentAge={gameState?.current_age || 0}
            currentStage={gameState?.current_stage || 0}
            onChoiceSelect={handleChoice}
          />
        ) : (
          <div className="text-center text-[#6a6a62] animate-pulse">
            Awaiting life events...
          </div>
        )}
      </main>
    </div>
  );
}
