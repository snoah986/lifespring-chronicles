import React from 'react';

export function BirthCertificate({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] p-8 flex flex-col justify-center animate-in fade-in duration-1000">
      <div className="max-w-md mx-auto border border-[#1c1c1f] p-8 space-y-8 relative overflow-hidden bg-black/40">
        <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-[#c2410c] opacity-30">SUB-732002</div>
        <div className="space-y-2 border-b border-[#1c1c1f] pb-6">
          <h2 className="text-sm font-mono tracking-[0.5em] text-[#c2410c] uppercase">Identity Dossier</h2>
          <p className="text-[9px] text-[#3f3f46] uppercase tracking-widest">Department of Vital Records & Simulation</p>
        </div>
        <div className="space-y-4 font-mono text-[11px] tracking-wider">
          <div className="flex justify-between"><span className="text-[#3f3f46]">ORIGIN:</span><span>WEMBLEY, UK</span></div>
          <div className="flex justify-between"><span className="text-[#3f3f46]">ANOMALY:</span><span className="text-green-500/80">HIGH PAIN TOLERANCE</span></div>
          <div className="flex justify-between"><span className="text-[#3f3f46]">DYNAMIC:</span><span>DISTANT WEALTHY</span></div>
        </div>
        <div className="pt-8">
          <button onClick={onStart} className="w-full py-4 bg-[#c2410c] text-white text-[10px] tracking-[0.5em] uppercase hover:bg-orange-600 transition-colors">Initialize Life</button>
        </div>
      </div>
    </div>
  );
}
