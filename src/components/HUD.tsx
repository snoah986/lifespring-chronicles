import React from 'react';
import { useGameStore } from '../store/gameStore';

export function HUD() {
  const { gameState } = useGameStore();
  return (
    <div className="bg-[#0d0d0d] border-b border-[#c2410c]/20 p-4 grid grid-cols-4 gap-4">
      <div className="flex flex-col"><span className="text-[7px] text-[#3f3f46] uppercase">Intelligence</span><span className="text-xs text-[#fafafa] font-mono">{gameState.stats.intelligence}</span></div>
      <div className="flex flex-col"><span className="text-[7px] text-[#3f3f46] uppercase">Wealth</span><span className="text-xs text-[#fafafa] font-mono">{gameState.stats.wealth}</span></div>
      <div className="flex flex-col"><span className="text-[7px] text-[#3f3f46] uppercase">Academic</span><span className="text-xs text-[#fafafa] font-mono">{gameState.stats.academic}</span></div>
      <div className="flex flex-col"><span className="text-[7px] text-[#3f3f46] uppercase">Stress</span><span className="text-xs text-[#c2410c] font-mono">{gameState.stats.stress}</span></div>
    </div>
  );
}
