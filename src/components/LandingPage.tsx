import React, { useState, useEffect } from 'react';

export function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (isLoading && loadProgress < 100) {
      const timer = setTimeout(() => setLoadProgress(prev => prev + 1), 20);
      return () => clearTimeout(timer);
    } else if (loadProgress >= 100) {
      window.location.href = '/play';
    }
  }, [isLoading, loadProgress]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#c2410c] flex flex-col items-center justify-center font-mono p-10">
        <div className="w-full max-w-xs space-y-8 text-center">
          <div className="text-[10px] tracking-[0.4em] uppercase opacity-40 animate-pulse">Neural Sync Active</div>
          <div className="relative h-[1px] w-full bg-[#1c1c1f]">
            <div className="h-full bg-[#c2410c] transition-all duration-200 shadow-[0_0_15px_#c2410c]" style={{ width: `${loadProgress}%` }} />
          </div>
          <div className="text-[10px] tracking-widest opacity-80">ESTABLISHING NODE: {loadProgress}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] flex flex-col justify-between p-12 font-serif overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="text-[9px] tracking-[0.4em] text-[#3f3f46] uppercase leading-relaxed">Multi-Agency Extraction // v5.0.2 <br/> Node: Wembley_Tactical</div>
        <div className="w-10 h-10 border border-[#27272a] flex items-center justify-center text-[10px] text-[#c2410c] font-mono hover:border-[#c2410c] transition-colors">LC</div>
      </div>
      <div className="relative border-l border-[#c2410c]/20 pl-8 py-4">
        <h1 className="text-8xl font-light tracking-tighter text-[#fafafa] mb-4 leading-[0.8]">Lifespring<br/><span className="italic text-[#c2410c]">Chronicles</span></h1>
        <p className="text-[10px] text-[#52525b] font-sans tracking-[0.3em] uppercase mt-6 leading-loose">A sentient world simulation. Every choice is a legacy.</p>
      </div>
      <div className="flex flex-col gap-10 items-start">
        <button onClick={() => setIsLoading(true)} className="group flex items-center gap-6 text-3xl font-light hover:text-white transition-all">
          <span className="w-12 h-[1px] bg-[#c2410c] group-hover:w-24 transition-all duration-700" />
          BEGIN EXTRACTION
        </button>
      </div>
      <div className="fixed right-12 bottom-32 origin-bottom-right -rotate-90 text-[8px] tracking-[0.6em] text-[#18181b] uppercase whitespace-nowrap">Extraction Mode: Enabled // Black Swan: 2.5%</div>
    </div>
  );
}
