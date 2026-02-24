-- Crypto and War Economics
ALTER TABLE game_states ADD COLUMN IF NOT EXISTS war_status TEXT DEFAULT 'peace';
ALTER TABLE game_states ADD COLUMN IF NOT EXISTS total_crypto_val FLOAT DEFAULT 0;

-- Ghost Memory Triggers
CREATE TABLE IF NOT EXISTS world_landmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_life_id UUID,
  name TEXT,
  location_data JSONB
);
