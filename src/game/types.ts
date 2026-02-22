export type LifeStage = 
  | 'childhood' 
  | 'adolescence' 
  | 'young_adult' 
  | 'adult' 
  | 'mid_life' 
  | 'elder' 
  | 'late_life';

export type RelationshipType = 
  | 'family' 
  | 'classmate' 
  | 'friend' 
  | 'rival' 
  | 'colleague' 
  | 'romantic' 
  | 'teacher' 
  | 'mentor' 
  | 'neighbor';

export type EmotionalValence = 'positive' | 'negative' | 'neutral';
export type InteractionDomain = 'professional' | 'social' | 'romantic' | 'financial' | 'family' | 'academic';

export interface Interaction {
  playerAge: number;
  type: string;
  valence: EmotionalValence;
  severity: number; // 1-10
  domain: InteractionDomain;
  description: string;
}

export interface NPC {
  id: string;
  name: string;
  birthYear: number;
  relationship: RelationshipType;
  interactions: Interaction[];
  alive: boolean;
  metAtAge: number;
}

export interface PlayerStats {
  health: number;       // 0-100
  happiness: number;    // 0-100
  money: number;        // 0-100
  reputation: number;   // 0-100
  karma: number;        // hidden, -100 to 100
}

export interface ChronicleEntry {
  age: number;
  text: string;
  valence: EmotionalValence;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  minAge: number;
  maxAge: number;
  stage: LifeStage[];
  choices: EventChoice[];
}

export interface EventChoice {
  id: string;
  text: string;
  effects: Partial<PlayerStats>;
  chronicleText: string;
  valence: EmotionalValence;
  npcInteraction?: {
    npcId: string;
    type: string;
    severity: number;
    domain: InteractionDomain;
  };
}

export interface ActiveEvent {
  event: GameEvent;
  involvedNPCs: string[];
}

export interface GameState {
  phase: 'start' | 'playing' | 'dead';
  playerName: string;
  birthYear: number;
  currentAge: number;
  stats: PlayerStats;
  npcs: NPC[];
  chronicle: ChronicleEntry[];
  currentEvent: ActiveEvent | null;
  career: string;
}

export function getLifeStage(age: number): LifeStage {
  if (age <= 11) return 'childhood';
  if (age <= 17) return 'adolescence';
  if (age <= 25) return 'young_adult';
  if (age <= 45) return 'adult';
  if (age <= 60) return 'mid_life';
  if (age <= 80) return 'elder';
  return 'late_life';
}

export function getLifeStageLabel(stage: LifeStage): string {
  const labels: Record<LifeStage, string> = {
    childhood: 'Childhood',
    adolescence: 'Adolescence',
    young_adult: 'Young Adult',
    adult: 'Adult',
    mid_life: 'Mid Life',
    elder: 'Elder',
    late_life: 'Late Life',
  };
  return labels[stage];
}
