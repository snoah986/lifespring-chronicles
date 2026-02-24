import React from 'react';

export function Archive() {
  return (
    <div className="w-full p-4 flex flex-col gap-4">
      <h2 className="text-sm font-mono text-slate-500 uppercase tracking-widest">The Archive</h2>
      <div className="border border-dashed border-slate-700 p-8 text-center text-slate-600 text-xs">
        Your keepsakes will be preserved here.
      </div>
    </div>
  );
}
