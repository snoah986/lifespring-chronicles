import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';

export function GameContainer() {
  const { gameState, currentEvent } = useGameStore();
  const { advanceLife } = useGameLoop();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] p-6 font-sans flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex justify-between text-[10px] tracking-widest uppercase text-[#52525b]">
          <span>Age: {gameState.current_age}</span>
          <span>Stage: {gameState.current_stage}</span>
        </div>
        <h2 className="text-2xl font-serif text-[#fafafa]">{currentEvent?.title || "Awaiting Life Events..."}</h2>
        <p className="text-sm text-[#71717a] leading-relaxed">{currentEvent?.narrative || "The world remains quiet."}</p>
      </div>
      
      <button 
        onClick={advanceLife}
        className="w-full py-4 border border-[#c2410c] text-[#c2410c] text-sm tracking-[0.3em] uppercase hover:bg-[#c2410c] hover:text-white transition-all duration-300"
      >
        AGE +1
      </button>
    </div>
  );
}
