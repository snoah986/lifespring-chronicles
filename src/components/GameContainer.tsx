import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { ACTIVITIES } from '../data/activities';

export function GameContainer() {
  const { gameState, currentEvent, activeTab, setTab, applyChoice } = useGameStore();
  const { advanceLife } = useGameLoop();

  const renderTabContent = () => {
    const currentActivities = ACTIVITIES[activeTab] || [];
    const available = currentActivities.filter(a => gameState.current_age >= a.minAge && gameState.current_age <= a.maxAge);

    if (activeTab === 'STORY') {
      return (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-4xl font-light text-[#fafafa] leading-tight">{currentEvent?.title || "Passive State"}</h3>
            <p className="text-lg text-[#71717a] font-light italic leading-relaxed">{currentEvent?.narrative}</p>
          </div>
          <div className="space-y-3">
            {currentEvent?.choices?.map((c, i) => (
              <button key={i} onClick={() => applyChoice(c.effects)} className="w-full py-4 border border-[#c2410c]/40 text-[10px] uppercase tracking-[0.2em] hover:bg-[#c2410c]">{c.text}</button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-[#c2410c] uppercase tracking-[0.4em] text-[10px] mb-8">{activeTab} MODULE</h3>
        {available.length > 0 ? available.map(a => (
          <button key={a.id} onClick={() => applyChoice(a.effects)} className="w-full p-6 bg-[#0d0d0d] border border-[#1c1c1f] text-left hover:border-[#c2410c] transition-all group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#fafafa] group-hover:text-[#c2410c] transition-colors">{a.label}</span>
              <span className="text-[8px] text-[#3f3f46] uppercase">Active</span>
            </div>
            <p className="text-[10px] text-[#71717a] leading-relaxed">{a.desc}</p>
          </button>
        )) : <div className="text-[10px] text-[#3f3f46] uppercase tracking-[0.4em] py-20 text-center">No available interactions at Age {gameState.current_age}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] flex flex-col font-serif">
      {/* Minimalist HUD */}
      <div className="p-6 border-b border-[#1c1c1f] flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[8px] text-[#3f3f46] uppercase tracking-widest">Subject: {gameState.name}</span>
          <span className="text-2xl font-light text-[#fafafa]">Year {gameState.current_age}</span>
        </div>
        <span className="text-[9px] font-mono text-[#c2410c] uppercase px-3 py-1 border border-[#c2410c]/20">Stage: {gameState.current_stage}</span>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">{renderTabContent()}</div>

      <div className="bg-[#0d0d0d] border-t border-[#1c1c1f]">
        <div className="grid grid-cols-4">
          {['STORY', 'ACADEMY', 'STADIUM', 'HUSTLE'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`py-5 text-[8px] tracking-[0.2em] uppercase transition-all ${activeTab === t ? 'text-[#c2410c] bg-[#141414]' : 'text-[#3f3f46]'}`}>{t}</button>
          ))}
        </div>
        <button onClick={advanceLife} className="w-full py-6 bg-[#c2410c] text-white text-[10px] tracking-[0.5em] uppercase hover:bg-orange-600 active:scale-95 transition-all">Advance Timeline</button>
      </div>
    </div>
  );
}
