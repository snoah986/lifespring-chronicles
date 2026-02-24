import React from 'react';
import { useGameStore } from '../store/gameStore';

export function GameContainer() {
  const { gameState, currentEvent, incrementAge } = useGameStore();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] p-10 flex flex-col justify-between">
      <div className="space-y-16">
        <div className="border-b border-[#1c1c1f] pb-8 flex justify-between items-end">
          <div>
            <p className="text-[10px] text-[#3f3f46] uppercase tracking-[0.4em] mb-2">Subject: {gameState.name}</p>
            <h2 className="text-4xl font-light text-[#fafafa]">Age {gameState.current_age}</h2>
          </div>
          <h2 className="text-[10px] font-mono text-[#c2410c] border border-[#c2410c]/30 px-3 py-1 uppercase">{gameState.current_stage}</h2>
        </div>
        
        <div className="space-y-8 max-w-xl">
          <h3 className="text-4xl font-serif text-[#fafafa] leading-tight tracking-tight">
            {currentEvent?.title || "Simulation Initialized"}
          </h3>
          <p className="text-lg text-[#71717a] font-light italic leading-relaxed">
            {currentEvent?.narrative || "You are currently observing the initial node of your extraction. The world is calibrated."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={incrementAge}
          className="w-full py-6 bg-transparent border border-[#c2410c] text-[#c2410c] text-[10px] tracking-[0.6em] uppercase hover:bg-[#c2410c] hover:text-white transition-all duration-700 active:scale-95"
        >
          Advance Life
        </button>
      </div>
    </div>
  );
}
