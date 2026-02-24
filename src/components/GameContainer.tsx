import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { HUD } from './HUD';

export function GameContainer() {
  const { gameState, currentEvent, activeTab, setTab } = useGameStore();
  const { advanceLife } = useGameLoop();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] flex flex-col font-serif">
      <HUD />
      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="flex justify-between items-center text-[10px] text-[#c2410c] uppercase tracking-widest border-b border-[#1c1c1f] pb-4">
          <span>Year: {gameState.current_age}</span>
          <span>Zone: {gameState.location}</span>
        </div>
        
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-light text-[#fafafa]">{currentEvent?.title || "Initializing..."}</h2>
          <p className="text-base text-[#71717a] leading-relaxed italic">{currentEvent?.narrative || "System awaiting tactical advance."}</p>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border-t border-[#1c1c1f]">
        <div className="grid grid-cols-4 border-b border-[#1c1c1f]">
          {['STORY', 'ACADEMY', 'STADIUM', 'HUSTLE'].map(t => (
            <button key={t} onClick={() => setTab(t)} 
                    className={`py-4 text-[7px] tracking-widest uppercase ${activeTab === t ? 'text-[#c2410c] border-b border-[#c2410c]' : 'text-[#3f3f46]'}`}>
              {t}
            </button>
          ))}
        </div>
        <button onClick={advanceLife} className="w-full py-6 bg-[#c2410c] text-white text-[10px] tracking-[0.5em] uppercase hover:bg-orange-600 transition-all">Advance Year</button>
      </div>
    </div>
  );
}
