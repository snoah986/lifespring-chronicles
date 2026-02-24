import React, { useState, useEffect } from 'react';

export function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (isLoading && loadProgress < 100) {
      const timer = setTimeout(() => setLoadProgress(prev => prev + 1), 25);
      return () => clearTimeout(timer);
    } else if (loadProgress >= 100) {
      window.location.href = '/play';
    }
  }, [isLoading, loadProgress]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#c2410c] flex flex-col items-center justify-center font-mono p-12">
        <div className="w-full max-w-sm space-y-10">
          <div className="text-[9px] tracking-[0.5em] uppercase opacity-40 text-center animate-pulse">
            Establishing Neural Link...
          </div>
          <div className="relative h-[1px] w-full bg-[#18181b]">
            <div 
              className="h-full bg-[#c2410c] transition-all duration-200 shadow-[0_0_20px_#c2410c]" 
              style={{ width: `${loadProgress}%` }} 
            />
          </div>
          <div className="flex justify-between text-[10px] tracking-widest font-light">
            <span className="opacity-60">ID_EXTRACTION</span>
            <span className="text-[#fafafa]">{loadProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] flex flex-col justify-between p-12 font-serif selection:bg-[#c2410c] overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="text-[8px] tracking-[0.4em] text-[#3f3f46] uppercase leading-relaxed">
          Multi-Agency Extraction // v5.0.2 <br/>
          Node: Wembley_UK_Static
        </div>
        <div className="w-12 h-12 border border-[#1c1c1f] flex items-center justify-center text-[10px] text-[#c2410c] font-mono hover:border-[#c2410c] transition-colors">
          L|C
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-4 top-0 w-[1px] h-full bg-[#c2410c] opacity-20" />
        <h1 className="text-8xl font-light tracking-tighter text-[#fafafa] mb-4 leading-[0.85]">
          Lifespring <br/>
          <span className="italic text-[#c2410c]">Chronicles</span>
        </h1>
        <p className="text-[10px] text-[#52525b] font-sans tracking-[0.3em] uppercase mt-8 leading-loose">
          Every shadow has a history. <br/>
          Every choice is an echo.
        </p>
      </div>

      <div className="flex flex-col gap-12 items-start relative z-10">
        <button 
          onClick={() => setIsLoading(true)}
          className="group flex items-center gap-8 text-4xl font-light hover:text-white transition-all duration-500"
        >
          <span className="w-16 h-[1px] bg-[#c2410c] group-hover:w-32 transition-all duration-700" />
          BEGIN
        </button>
        <div className="flex gap-10">
          <button className="text-[9px] tracking-[0.4em] text-[#27272a] hover:text-[#71717a] uppercase transition-colors">Archive</button>
          <button className="text-[9px] tracking-[0.4em] text-[#27272a] hover:text-[#71717a] uppercase transition-colors">Syndicate_Logs</button>
        </div>
      </div>

      <div className="fixed right-12 bottom-32 origin-bottom-right -rotate-90 text-[7px] tracking-[0.6em] text-[#18181b] uppercase whitespace-nowrap">
         Black Swan: 2.5% // Reality_Sync: 0.98 // Wembley_Node_Active
      </div>
    </div>
  );
}
