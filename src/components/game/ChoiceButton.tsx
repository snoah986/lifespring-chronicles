import React, { useState } from 'react';
import type { Choice } from '../../types';

interface ChoiceButtonProps {
  choice: Choice;
  onSelect: (choice: Choice) => void;
  disabled?: boolean;
  isLocked?: boolean;
  lockHint?: string;
  requiresConfirmation?: boolean;
}

export function ChoiceButton({ 
  choice, 
  onSelect, 
  disabled = false,
  isLocked = false,
  lockHint,
  requiresConfirmation = false
}: ChoiceButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (isLocked) {
    return (
      <button disabled className="w-full text-left p-4 rounded-lg border-2 border-slate-800 bg-slate-900 text-slate-500 opacity-60 cursor-not-allowed flex items-center gap-3">
        <span className="text-xl">🔒</span>
        <div className="flex flex-col">
          <span className="font-inter text-sm line-through">{choice.text}</span>
          <span className="text-xs text-red-400/80 font-mono mt-1">{lockHint || "Path locked due to past choices."}</span>
        </div>
      </button>
    );
  }

  if (showConfirm) {
    return (
      <div className="w-full p-4 rounded-lg border-2 border-red-500/50 bg-red-950/20 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
        <span className="text-sm text-red-200 font-medium text-center">Are you certain? This choice has major consequences.</span>
        <div className="flex gap-2">
          <button onClick={() => setShowConfirm(false)} className="flex-1 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-sm transition-colors">Cancel</button>
          <button onClick={() => onSelect(choice)} className="flex-1 p-2 bg-red-900 hover:bg-red-800 text-red-100 rounded-md text-sm transition-colors font-medium">Confirm</button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => requiresConfirmation ? setShowConfirm(true) : onSelect(choice)}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 
        ${disabled 
          ? 'border-slate-800 bg-slate-900 text-slate-500 opacity-50 cursor-not-allowed' 
          : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-blue-500 hover:bg-slate-700 active:scale-[0.98]'
        } flex flex-col gap-2 relative group`}
    >
      <span className="font-inter text-sm md:text-base leading-relaxed">{choice.text}</span>
    </button>
  );
}
