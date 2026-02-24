import React from 'react';
import { useGameStore } from '../store/gameStore';
import { HUD } from './HUD';

export function GameContainer() {
  const { gameState, currentEvent, activeTab, setTab, applyChoice, incrementAge } = useGameStore();

  const renderContent = () => {
    if (activeTab === 'STORY') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-[#fafafa]">{currentEvent?.title || "Passive Extraction..."}</h2>
          <p className="text-sm text-[#71717a] italic">{currentEvent?.narrative || "The world moves around you."}</p>
          <div className="flex flex-col gap-3">
            {currentEvent?.choices?.map((c, i) => (
              <button key={i} onClick={() => applyChoice(c.effects)} 
                      className="w-full py-3 border border-[#c2410c]/30 text-[#fafafa] text-[10px] tracking-widest uppercase hover:bg-[#c2410c] transition-all">
                {c.text}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-40 border border-dashed border-[#1c1c1f]">
        <p className="text-[10px] text-[#3f3f46] uppercase tracking-[0.4em]">{activeTab} MODULE OFFLINE AT AGE {gameState.current_age}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] flex flex-col">
      <HUD />
      <div className="p-8 flex-1">{renderContent()}</div>
      
      {/* Navigation Bar */}
      <div className="grid grid-cols-5 border-t border-[#1c1c1f] bg-[#0d0d0d]">
        {['STORY', 'ACADEMY', 'STADIUM', 'HUSTLE', 'NETWORK'].map(t => (
          <button key={t} onClick={() => setTab(t)} 
                  className={`py-4 text-[7px] tracking-widest uppercase ${activeTab === t ? 'text-[#c2410c] border-t border-[#c2410c]' : 'text-[#3f3f46]'}`}>
            {t}
          </button>
        ))}
      </div>
      
      <button onClick={incrementAge} className="w-full py-4 bg-[#c2410c] text-white text-[10px] tracking-[0.5em] uppercase">Advance Year</button>
    </div>
  );
}
