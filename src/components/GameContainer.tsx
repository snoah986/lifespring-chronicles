import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';

export function GameContainer() {
  const { gameState, currentEvent, activeTab, setTab, applyChoice } = useGameStore();
  const { advanceLife } = useGameLoop();

  const renderTabContent = () => {
    switch(activeTab) {
      case 'ACADEMY': return <div className="p-4 border border-[#1c1c1f]">Rank: Grade A | Focus: Science</div>;
      case 'STADIUM': return <div className="p-4 border border-[#1c1c1f]">Condition: 85% | Speed: Elite</div>;
      case 'HUSTLE': return <div className="p-4 border border-[#1c1c1f]">Balance: ${gameState.stats.wealth} | Job: Intern</div>;
      default: return (
        <div className="space-y-6">
          <h3 className="text-3xl font-light">{currentEvent?.title || "Story Start"}</h3>
          <p className="text-[#71717a] italic">{currentEvent?.narrative || "Your journey begins."}</p>
          <div className="space-y-3">
            {currentEvent?.choices?.map((c, i) => (
              <button key={i} onClick={() => applyChoice(c.effects)} className="w-full py-3 border border-[#c2410c]/40 text-[10px] uppercase hover:bg-[#c2410c]">{c.text}</button>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="flex-1 p-8">{renderTabContent()}</div>
      <div className="grid grid-cols-4 bg-[#0d0d0d] border-t border-[#1c1c1f]">
        {['STORY', 'ACADEMY', 'STADIUM', 'HUSTLE'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`py-4 text-[8px] uppercase ${activeTab === t ? 'text-[#c2410c]' : 'text-[#3f3f46]'}`}>{t}</button>
        ))}
      </div>
      <button onClick={advanceLife} className="py-6 bg-[#c2410c] text-white text-[10px] uppercase tracking-widest">Advance Year</button>
    </div>
  );
}
