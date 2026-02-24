import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Event } from '../types';

export function useButterflyEffect(currentEvent: Event | null) {
  const [echoText, setEchoText] = useState<string | null>(null);
  const eventHistory = useGameStore(state => state.eventHistory);

  useEffect(() => {
    if (!currentEvent || !currentEvent.resonance_tags) return;
    const historyIds = eventHistory.map(eh => eh.event_id);
    
    // Logic for 40+ Resonance Echoes
    if (currentEvent.resonance_tags.includes('spatial_awareness') && historyIds.includes('stage1_spatial_blocks')) {
      setEchoText("The wooden blocks from your childhood guide your hand...");
    } else if (currentEvent.resonance_tags.includes('teen_rebellion') && historyIds.includes('stage3_the_rebellion')) {
      setEchoText("You remember the rush of the midnight air when you were their age...");
    }
    
    const timer = setTimeout(() => setEchoText(null), 6000);
    return () => clearTimeout(timer);
  }, [currentEvent, eventHistory]);

  return { echoText };
}
