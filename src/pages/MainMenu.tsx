import React from 'react';

export function MainMenu() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-[#f5f5f0] p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-1000">
        <h1 className="text-5xl font-lora font-semibold tracking-tight">Lifespring Chronicles</h1>
        <p className="text-lg text-[#b8b8a8] font-inter">Every choice echoes. Every life matters.</p>
        
        <div className="flex flex-col gap-4 mt-12">
          <button onClick={() => window.location.href='/new-game'} className="w-full bg-[#f4b8a8] text-[#0a0a0b] py-4 rounded-lg font-medium text-lg hover:scale-[1.02] transition-transform">
            Begin a New Life
          </button>
          <button disabled className="w-full bg-[#1a1a1c] border border-[#3a3a3d] text-[#6a6a62] py-4 rounded-lg font-medium text-lg cursor-not-allowed">
            Load Saved Life
          </button>
        </div>
      </div>
    </div>
  );
}
