-- Interlinked Life Effects
ALTER TABLE game_states ADD COLUMN IF NOT EXISTS previous_life_syndicate_rank INTEGER DEFAULT 0;
ALTER TABLE game_states ADD COLUMN IF NOT EXISTS ghost_memory_unlocked BOOLEAN DEFAULT false;

-- Governance and Crypto Tables
CREATE TABLE IF NOT EXISTS crypto_wallet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES game_states(id),
  asset_symbol TEXT,
  amount FLOAT
);

CREATE TABLE IF NOT EXISTS national_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leader_id UUID REFERENCES game_states(id),
  policy_name TEXT,
  is_active BOOLEAN
);
