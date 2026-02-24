CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE game_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_age INTEGER NOT NULL CHECK (current_age >= 0 AND current_age <= 120),
  current_stage INTEGER NOT NULL CHECK (current_stage >= 0 AND current_stage <= 10),
  stats JSONB NOT NULL,
  financial_state JSONB NOT NULL,
  regret_index INTEGER DEFAULT 0,
  legacy_points INTEGER DEFAULT 0,
  is_alive BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_saved_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE life_stage AS ENUM (
  'birth_infancy', 'early_childhood', 'middle_childhood', 'teen_years',
  'late_teen', 'young_adult_1', 'young_adult_2', 'adult_peak',
  'middle_age', 'senior', 'end_of_life'
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  narrative TEXT NOT NULL,
  min_age INTEGER NOT NULL,
  max_age INTEGER NOT NULL,
  stage life_stage NOT NULL,
  is_milestone BOOLEAN DEFAULT false,
  choices JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_state_id UUID NOT NULL REFERENCES game_states(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id),
  age_occurred INTEGER NOT NULL,
  stage_occurred life_stage NOT NULL,
  choice_index INTEGER NOT NULL,
  stat_deltas JSONB NOT NULL,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE npc_type AS ENUM ('family', 'friend', 'partner', 'rival', 'mentor', 'child');
CREATE TYPE npc_status AS ENUM ('alive', 'estranged', 'deceased', 'lost_touch');

CREATE TABLE npcs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_state_id UUID NOT NULL REFERENCES game_states(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type npc_type NOT NULL,
  depth INTEGER DEFAULT 0,
  trust INTEGER DEFAULT 50,
  status npc_status DEFAULT 'alive',
  last_interaction_age INTEGER,
  created_at_age INTEGER NOT NULL
);
