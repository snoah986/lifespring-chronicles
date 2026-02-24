import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Event } from '../types';

export function useButterflyEffect(currentEvent: Event | null) {
  const [echoText, setEchoText] = useState<string | null>(null);
  const eventHistory = useGameStore(state => state.eventHistory);

  useEffect(() => {
    if (!currentEvent || !currentEvent.resonance_tags) {
      setEchoText(null);
      return;
    }

    const historyIds = eventHistory.map(eh => eh.event_id);
    let foundEcho = null;

    if (currentEvent.resonance_tags.includes('childhood_trauma') && historyIds.includes('stage1_parent_conflict')) {
      foundEcho = "The shouting from decades ago rings in your ears today...";
    } else if (currentEvent.resonance_tags.includes('spatial_awareness') && historyIds.includes('stage1_spatial_blocks')) {
      foundEcho = "The wooden blocks from your childhood guide your hand...";
    } else if (currentEvent.resonance_tags.includes('teen_rebellion') && historyIds.includes('stage3_the_rebellion')) {
      foundEcho = "You remember the rush of the midnight air when you were their age...";
    }

    if (foundEcho) {
      setEchoText(foundEcho);
      setTimeout(() => setEchoText(null), 6000);
    }
  }, [currentEvent, eventHistory]);

  return { echoText };
}
