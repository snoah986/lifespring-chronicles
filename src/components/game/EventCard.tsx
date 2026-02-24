import React from 'react';
import type { Event, LifeStage } from '../../types';
import { ChoiceButton } from './ChoiceButton';

interface EventCardProps {
  event: Event;
  currentAge: number;
  currentStage: LifeStage;
  onChoiceSelect: (choiceIndex: number) => void;
}

export function EventCard({ event, currentAge, currentStage, onChoiceSelect }: EventCardProps) {
  // Future implementation: gradient generation based on event weight
  const baseGradient = "bg-gradient-to-b from-[#1a1a1c] to-[#111112]";

  return (
    <div className={`w-full max-w-2xl mx-auto ${baseGradient} border border-[#3a3a3d] rounded-xl p-6 shadow-2xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className="flex justify-between items-center border-b border-[#3a3a3d] pb-4">
        <h2 className="text-2xl font-medium font-lora text-[#f5f5f0]">{event.title}</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-800/80 text-slate-300 font-mono text-sm rounded-full border border-slate-700 backdrop-blur-sm">
            Age {currentAge}
          </span>
        </div>
      </div>
      
      {/* Future implementation: Situational NPC Avatars will inject here */}
      
      <div className="prose prose-invert max-w-none">
        <p className="text-lg font-lora text-[#e5e5e0] leading-relaxed">
          {event.narrative}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {event.choices.map((choice, index) => (
          <ChoiceButton 
            key={index} 
            choice={choice} 
            onSelect={() => onChoiceSelect(index)}
            requiresConfirmation={choice.regretWeight !== undefined && choice.regretWeight > 50}
          />
        ))}
      </div>
    </div>
  );
}
