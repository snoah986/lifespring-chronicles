import { useState } from 'react';
import type { Event, StatBlock } from '../types';

export function useAINarrator() {
  const [isDrafting, setIsDrafting] = useState(false);
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);

  const generateNarrative = async (event: Event, stats: StatBlock) => {
    setIsDrafting(true);
    // Tone Distortion Filter based on Mental Health
    let tone = stats.mental_health < 30 ? "cynical" : stats.mental_health > 80 ? "hopeful" : "neutral";
    
    setTimeout(() => {
      setAiNarrative(`(Tone: ${tone}) ${event.narrative}`);
      setIsDrafting(false);
    }, 2000);
  };

  return { generateNarrative, isDrafting, aiNarrative };
}
