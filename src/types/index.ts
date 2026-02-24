export enum LifeStage {
  BIRTH = 0,
  EARLY_CHILDHOOD = 1,
  MIDDLE_CHILDHOOD = 2,
  TEEN_YEARS = 3,
  LATE_TEEN = 4,
  YOUNG_ADULT_1 = 5,
  YOUNG_ADULT_2 = 6,
  ADULT_PEAK = 7,
  MIDDLE_AGE = 8,
  SENIOR = 9,
  END_OF_LIFE = 10
}

export interface StatBlock {
  health: number;
  happiness: number;
  wealth: number;
  intelligence: number;
  social: number;
  creativity: number;
  fitness: number;
  spirituality: number;
  resilience: number;
  wisdom: number;
  reputation: number;
  mental_health: number;
}

export interface GameState {
  id?: string;
  player_id?: string;
  current_age: number;
  current_stage: LifeStage;
  stats: StatBlock;
  financial_state: any;
  regret_index: number;
  legacy_points: number;
  bucket_list: any[];
  is_alive: boolean;
}

export interface Choice {
  text: string;
  statDeltas?: Partial<StatBlock>;
  npcEffects?: any[];
  unlocksEvents?: string[];
  locksEvents?: string[];
  regretWeight?: number;
  legacyPoints?: number;
}

export interface Event {
  id: string;
  event_key: string;
  title: string;
  narrative: string;
  min_age: number;
  max_age: number;
  stage: LifeStage;
  is_milestone: boolean;
  random_chance?: number;
  choices: Choice[];
}

export interface EventHistory {
  id?: string;
  game_state_id: string;
  event_id: string;
  age_occurred: number;
  choice_made: number;
  stat_state_before: StatBlock;
  stat_state_after: StatBlock;
}

export interface NPC {
  id: string;
  name: string;
  type: 'family' | 'friend' | 'partner' | 'rival' | 'mentor' | 'child';
  depth: number;
  trust: number;
  loyalty: number;
  status: 'alive' | 'estranged' | 'deceased' | 'lost_touch';
  last_interaction_age: number;
}
