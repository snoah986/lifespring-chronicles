-- Expanded Career Path Seeds
INSERT INTO career_paths (path_type, name, description) VALUES 
('sole_trader', 'Sole Trader', 'Build a business from scratch.'),
('streamer', 'Content Creator', 'Manage virality and parasocial bonds.'),
('military', 'Military Service', 'High risk, high discipline SITREPS.'),
('politician', 'Public Office', 'Pass edicts and manage polls.'),
('mafia', 'The Syndicate', 'High wealth, high NPC collateral.');

-- Resonance Tag Support
ALTER TABLE events ADD COLUMN IF NOT EXISTS resonance_tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Black Swan and Global Trend State
ALTER TABLE game_states ADD COLUMN IF NOT EXISTS global_stability FLOAT DEFAULT 1.0;
ALTER TABLE game_states ADD COLUMN IF NOT EXISTS is_black_swan BOOLEAN DEFAULT false;
