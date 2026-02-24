INSERT INTO events (event_key, title, narrative, min_age, max_age, stage, is_milestone, choices)
VALUES (
  'stage2_hobby_obsession',
  'The Fixation',
  'You have discovered a hobby that consumes your waking thoughts. Your parents are calling you for dinner.',
  8, 12, 'middle_childhood', false,
  '[
    {
      "text": "Ignore them. Keep working.",
      "stat_deltas": {"intelligence": 15, "social": -15, "mental_health": -5},
      "unlocks_events": ["hobby_burnout_risk"],
      "legacy_points": 5
    }
  ]'::jsonb
);

INSERT INTO events (event_key, title, narrative, min_age, max_age, stage, is_milestone, choices)
VALUES (
  'stage3_the_rebellion',
  'Curfew Shattered',
  'It is 2 AM. Your curfew was midnight. The house is dark.',
  15, 17, 'teen_years', true,
  '[
    {
      "text": "Lie smoothly. Blame a flat tire.",
      "stat_deltas": {"intelligence": 5, "reputation": -5},
      "npc_effects": [{"type": "family", "trust": -20}],
      "unlocks_events": ["rebellion_snowball_active"],
      "legacy_points": 0
    }
  ]'::jsonb
);

ALTER TABLE events ADD COLUMN IF NOT EXISTS resonance_tags TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE events SET resonance_tags = ARRAY['spatial_awareness'] WHERE event_key = 'stage1_spatial_blocks';
UPDATE events SET resonance_tags = ARRAY['teen_rebellion'] WHERE event_key = 'stage3_the_rebellion';
