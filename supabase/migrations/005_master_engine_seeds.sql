-- The 2.5% Black Swan Generator
ALTER TABLE game_states ADD COLUMN IF NOT EXISTS swan_event_triggered BOOLEAN DEFAULT (RANDOM() < 0.025);

-- Career Pivot & IP Ownership
INSERT INTO career_paths (path_type, name, description) VALUES 
('sole_trader_v2', 'Strategic Founder', 'Transition from vendor to CEO.'),
('pro_athlete', 'Pro Athlete', 'High-stakes performance with cull risk.');

-- Property and Asset Tiers
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES game_states(id),
  asset_type TEXT,
  market_value FLOAT,
  equity FLOAT
);
