import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';

export function GameContainer() {
  const { gameState, currentEvent } = useGameStore();
  const { advanceLife } = useGameLoop();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] p-8 font-sans flex flex-col justify-between">
      <div className="space-y-16">
        <div className="flex justify-between items-end border-b border-[#1c1c1f] pb-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#3f3f46] uppercase tracking-widest mb-1">Timeline</span>
            <span className="text-3xl font-light text-[#fafafa]">Age {gameState.current_age}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#3f3f46] uppercase tracking-widest mb-1">Sector</span>
            <span className="text-sm font-mono text-[#c2410c] uppercase tracking-wider">{gameState.current_stage}</span>
          </div>
        </div>
        <div className="space-y-8 max-w-lg">
          <h2 className="text-4xl font-serif text-[#fafafa] leading-tight tracking-tight">{currentEvent?.title || "Awaiting life events..."}</h2>
          <p className="text-lg text-[#71717a] leading-relaxed font-light italic">{currentEvent?.narrative || "The simulation is initializing your trajectory."}</p>
        </div>
      </div>
      <div className="pt-16 pb-8">
        <button 
          onClick={advanceLife}
          className="w-full py-6 bg-transparent border border-[#c2410c] text-[#c2410c] text-xs tracking-[0.5em] uppercase hover:bg-[#c2410c] hover:text-white transition-all duration-700 shadow-[0_0_20px_rgba(194,65,12,0.05)]"
        >
          Advance Life
        </button>
      </div>
    </div>
  );
}
