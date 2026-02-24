import { create } from 'zustand';
import type { GameState, Event, EventHistory, NPC, StatBlock } from '../types';

interface GameStoreState {
  gameState: GameState | null;
  loadedEvents: Event[];
  currentEvent: Event | null;
  eventHistory: EventHistory[];
  npcs: NPC[];
  loadGame: (gameId: string) => Promise<void>;
  saveGame: () => Promise<void>;
  applyStatDeltas: (deltas: Partial<StatBlock>) => void;
  progressAge: (years: number) => void;
  addEventToHistory: (event: Event, choice: any) => void;
  updateNPC: (npcId: string, updates: Partial<NPC>) => void;
  calculateLegacyScore: () => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  gameState: null,
  loadedEvents: [],
  currentEvent: null,
  eventHistory: [],
  npcs: [],
  loadGame: async (gameId) => {},
  saveGame: async () => {},
  applyStatDeltas: (deltas) => {},
  progressAge: (years) => {},
  addEventToHistory: (event, choice) => {},
  updateNPC: (npcId, updates) => {},
  calculateLegacyScore: () => {},
}));
