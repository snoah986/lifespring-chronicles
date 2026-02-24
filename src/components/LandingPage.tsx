import React, { useState, useEffect } from 'react';

export function LandingPage({ onComplete }: { onComplete: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading && progress < 100) {
      const timer = setTimeout(() => setProgress(p => p + 1), 15);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      onComplete();
    }
  }, [isLoading, progress, onComplete]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-10 font-mono text-[#c2410c]">
        <div className="w-full max-w-xs space-y-6">
          <div className="h-[1px] w-full bg-[#1c1c1f] relative"><div className="absolute h-full bg-[#c2410c] shadow-[0_0_15px_#c2410c]" style={{ width: `${progress}%` }} /></div>
          <div className="flex justify-between text-[10px] tracking-[0.4em]"><span>NEURAL_SYNC</span><span>{progress}%</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] flex flex-col justify-between p-12 font-serif overflow-hidden">
      <div className="flex justify-between items-start text-[9px] tracking-[0.4em] text-[#3f3f46] uppercase">
        <div>Extraction // Node: Wembley</div>
        <div className="text-[#c2410c] font-mono">L|C</div>
      </div>
      <div className="border-l border-[#c2410c]/20 pl-8">
        <h1 className="text-8xl font-light tracking-tighter text-[#fafafa] leading-[0.8]">Lifespring<br/><span className="italic text-[#c2410c]">Chronicles</span></h1>
        <p className="text-[10px] text-[#52525b] uppercase tracking-[0.4em] mt-8">Sentient World Simulation</p>
      </div>
      <button onClick={() => setIsLoading(true)} className="group flex items-center gap-6 text-3xl font-light hover:text-white transition-all">
        <span className="w-12 h-[1px] bg-[#c2410c] group-hover:w-24 transition-all duration-700" />
        BEGIN EXTRACTION
      </button>
    </div>
  );
}
