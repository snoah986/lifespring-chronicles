import type { Event, GameState, EventHistory, LifeStage } from '../types';

export function isEventUnlocked(event: Event, eventHistory: EventHistory[]): boolean {
  const historyIds = eventHistory.map(eh => eh.event_id);
  
  if (event.locked_by_events && event.locked_by_events.length > 0) {
    const isLocked = event.locked_by_events.some(lockedId => historyIds.includes(lockedId));
    if (isLocked) return false;
  }

  if (event.required_prior_events && event.required_prior_events.length > 0) {
    const hasRequired = event.required_prior_events.every(reqId => historyIds.includes(reqId));
    if (!hasRequired) return false;
  }

  return true;
}

export function getNextEvent(gameState: GameState, eventHistory: EventHistory[], availableEvents: Event[]): Event | null {
  const eligibleEvents = availableEvents.filter(event => {
    if (gameState.current_age < event.min_age || gameState.current_age > event.max_age) return false;
    if (gameState.current_stage !== event.stage) return false;
    
    const alreadyExperienced = eventHistory.some(eh => eh.event_id === event.id);
    if (alreadyExperienced) return false;

    return isEventUnlocked(event, eventHistory);
  });

  if (eligibleEvents.length === 0) return null;

  const mandatoryEvent = eligibleEvents.find(e => e.is_milestone);
  if (mandatoryEvent) return mandatoryEvent;

  const randomIndex = Math.floor(Math.random() * eligibleEvents.length);
  return eligibleEvents[randomIndex];
}
