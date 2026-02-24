import React from 'react';
import { useGameStore } from '../store/gameStore';

export function BirthCertificate({ onStart }: { onStart: () => void }) {
  const { gameState } = useGameStore();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] p-8 flex flex-col justify-center animate-in fade-in duration-1000">
      <div className="max-w-md mx-auto border border-[#1c1c1f] p-10 space-y-10 bg-black/40 relative">
        <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-[#c2410c] opacity-30">REF: LC-2026</div>
        <div className="space-y-2 border-b border-[#1c1c1f] pb-6">
          <h2 className="text-sm font-mono tracking-[0.6em] text-[#c2410c] uppercase">Identity Dossier</h2>
          <p className="text-[9px] text-[#3f3f46] uppercase tracking-widest">VITAL EXTRACTION COMPLETE</p>
        </div>
        <div className="space-y-4 font-mono text-[11px] tracking-widest">
          <div className="flex justify-between border-b border-[#1c1c1f]/30 pb-2">
            <span className="text-[#3f3f46]">NAME:</span>
            <span className="uppercase">{gameState.name}</span>
          </div>
          <div className="flex justify-between border-b border-[#1c1c1f]/30 pb-2">
            <span className="text-[#3f3f46]">GENDER:</span>
            <span className="uppercase">{gameState.gender}</span>
          </div>
          <div className="flex justify-between border-b border-[#1c1c1f]/30 pb-2">
            <span className="text-[#3f3f46]">ZONE:</span>
            <span className="uppercase">{gameState.location}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-[#3f3f46]">ANOMALY:</span>
            <span className="text-green-500/80">HIGH PAIN TOLERANCE</span>
          </div>
        </div>
        <button onClick={onStart} className="w-full py-5 bg-[#c2410c] text-white text-[10px] tracking-[0.6em] uppercase hover:bg-orange-600 transition-colors">Initialize Simulation</button>
      </div>
    </div>
  );
}
