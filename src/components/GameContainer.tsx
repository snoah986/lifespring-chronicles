import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';

export function GameContainer() {
  const { gameState, currentEvent } = useGameStore();
  const { advanceLife } = useGameLoop();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] p-8 flex flex-col justify-between">
      <div className="space-y-12">
        <div className="border-b border-[#1c1c1f] pb-6 flex justify-between items-end">
          <div>
            <p className="text-[10px] text-[#3f3f46] uppercase tracking-[0.3em]">Timeline</p>
            <h2 className="text-3xl font-light text-[#fafafa]">Age {gameState.current_age}</h2>
          </div>
          <h2 className="text-sm font-mono text-[#c2410c] uppercase">{gameState.current_stage}</h2>
        </div>
        <div className="space-y-8">
          <h3 className="text-4xl font-serif text-[#fafafa] leading-tight">{currentEvent?.title || "Initializing..."}</h3>
          <p className="text-lg text-[#71717a] font-light italic leading-relaxed">{currentEvent?.narrative || "The world is quiet as the simulation calibrates."}</p>
        </div>
      </div>
      <button 
        onClick={advanceLife}
        className="w-full py-6 border border-[#c2410c] text-[#c2410c] text-xs tracking-[0.5em] uppercase hover:bg-[#c2410c] hover:text-white transition-all duration-700 active:scale-95"
      >
        Advance Life
      </button>
    </div>
  );
}
