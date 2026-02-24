import { useState } from 'react';
import type { Event, StatBlock } from '../types';

export function useAINarrator() {
  const [isDrafting, setIsDrafting] = useState(false);
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);

  const generateNarrative = async (event: Event, stats: StatBlock) => {
    setIsDrafting(true);
    
    let toneDirective = "neutral and observational";
    if (stats.mental_health < 30) toneDirective = "cynical, muted, and slightly melancholic";
    if (stats.mental_health > 80) toneDirective = "vivid, hopeful, and deeply appreciative";

    setTimeout(() => {
      const prefix = stats.mental_health < 30 ? "Everything feels heavy. " : 
                     stats.mental_health > 80 ? "The world feels impossibly bright. " : "";
      
      setAiNarrative(`${prefix} ${event.narrative} (AI Narrative Tone: ${toneDirective})`);
      setIsDrafting(false);
    }, 2500);
  };

  return { generateNarrative, isDrafting, aiNarrative, setAiNarrative };
}
