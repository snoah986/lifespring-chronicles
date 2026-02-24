import React from 'react';

interface StatBarProps {
  statName: string;
  value: number;
  maxValue?: number;
  delta?: number;
  color?: string;
  showLabel?: boolean;
}

export function StatBar({
  statName,
  value,
  maxValue = 100,
  delta,
  color = 'bg-blue-500',
  showLabel = true
}: StatBarProps) {
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));

  return (
    <div className="flex flex-col gap-1 w-full mb-2 relative">
      {showLabel && (
        <div className="flex justify-between text-xs font-inter text-slate-300">
          <span className="capitalize">{statName.replace('_', ' ')}</span>
          <span className="font-mono">{Math.round(value)}/{maxValue}</span>
        </div>
      )}
      {/* Future implementation zone for biological/tension interdependency indicators */}
      <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div 
          className={`h-full ${color} transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
        {/* Physical Threshold Markers */}
        <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-red-500/50 z-10" />
        <div className="absolute top-0 bottom-0 left-[60%] w-[1px] bg-yellow-500/30 z-10" />
      </div>
      {delta !== undefined && delta !== 0 && (
        <span className={`text-xs ${delta > 0 ? 'text-green-400' : 'text-red-400'} animate-pulse`}>
          {delta > 0 ? '+' : ''}{delta}
        </span>
      )}
    </div>
  );
}
