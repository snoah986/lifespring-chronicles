import React from 'react';

export function NewGame() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#1a1a1c] border border-[#3a3a3d] rounded-xl p-8 text-center space-y-6">
        <h2 className="text-3xl font-lora text-[#f5f5f0]">The Beginning</h2>
        <p className="text-lg text-[#b8b8a8] font-lora leading-relaxed">
          You are about to be born into a procedurally generated life. Your starting circumstances, family wealth, and inherent temperament will be determined by chance. From there, your choices will shape your legacy.
        </p>
        <button onClick={() => window.location.href='/game'} className="mt-8 px-8 py-3 bg-[#5ba3ff] text-[#0a0a0b] rounded-lg font-medium hover:scale-[1.02] transition-transform">
          Take Your First Breath
        </button>
      </div>
    </div>
  );
}
