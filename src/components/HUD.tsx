import React from 'react';
import { useGameStore } from '../store/gameStore';

export function HUD() {
  const { gameState } = useGameStore();
  const statEntries = Object.entries(gameState.stats);

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-[#0d0d0d] border-b border-[#1c1c1f]">
      {statEntries.map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <span className="text-[7px] uppercase tracking-widest text-[#3f3f46]">{key.replace('_', ' ')}</span>
          <div className="flex items-center gap-1">
            <div className="h-[2px] flex-1 bg-[#1c1c1f] relative">
              <div className="absolute h-full bg-[#c2410c]" style={{ width: `${Math.min(value, 100)}%` }} />
            </div>
            <span className="text-[8px] font-mono text-[#fafafa]">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
