-- Injecting Stage 0 (Birth & Infancy)
-- Focuses strictly on primitive Neurological Phasing

INSERT INTO events (event_key, title, narrative, min_age, max_age, stage, is_milestone, is_mandatory, choices)
VALUES (
  'stage0_awakening',
  'Sensory Awakening',
  'Colors resolve from the blur. The world is loud, cold, and overwhelmingly bright. You possess no language, only primitive needs.',
  0, 1, 'birth_infancy', true, true,
  '[
    {
      "text": "Cry out for warmth.",
      "stat_deltas": {"health": 5, "happiness": 10},
      "legacy_points": 0
    },
    {
      "text": "Observe the shifting lights in silence.",
      "stat_deltas": {"health": 2, "intelligence": 5},
      "unlocks_events": ["latent_observation_seed"],
      "legacy_points": 0
    }
  ]'::jsonb
);

-- Injecting Stage 1 (Early Childhood)
-- Focuses on Latent Skill Seeds and the Imaginary Friend

INSERT INTO events (event_key, title, narrative, min_age, max_age, stage, is_milestone, is_mandatory, choices)
VALUES (
  'stage1_spatial_blocks',
  'The Wooden Towers',
  'Someone has left a pile of painted wooden blocks on the rug. They smell of pine and dust. You realize you can stack them to defy gravity.',
  3, 5, 'early_childhood', false, false,
  '[
    {
      "text": "Build the tallest tower possible until it collapses.",
      "stat_deltas": {"creativity": 10, "happiness": -5},
      "unlocks_events": ["latent_spatial_seed"],
      "legacy_points": 5
    },
    {
      "text": "Sort them meticulously by color and shape.",
      "stat_deltas": {"intelligence": 10},
      "unlocks_events": ["latent_logic_seed"],
      "legacy_points": 5
    },
    {
      "text": "Throw them at the nearest wall to hear the noise.",
      "stat_deltas": {"social": -5, "health": 5},
      "unlocks_events": ["latent_kinetic_seed"],
      "legacy_points": 0
    }
  ]'::jsonb
);

INSERT INTO events (event_key, title, narrative, min_age, max_age, stage, is_milestone, is_mandatory, choices)
VALUES (
  'stage1_imaginary_friend',
  'A Visitor in the Shadows',
  'You are alone in your room when you realize the shadow by the closet is looking back at you. It does not speak with words, but you understand it perfectly.',
  4, 6, 'early_childhood', false, false,
  '[
    {
      "text": "Welcome them. Give them a name and a voice.",
      "stat_deltas": {"creativity": 25, "mental_health": -5},
      "npc_effects": [{"type": "friend", "name": "The Visitor", "depth": 50, "trust": 100}],
      "unlocks_events": ["imaginary_friend_active"],
      "legacy_points": 10
    },
    {
      "text": "Hide under the blankets. Reject the anomaly.",
      "stat_deltas": {"resilience": 15, "creativity": -10},
      "locks_events": ["imaginary_friend_active"],
      "legacy_points": 5
    }
  ]'::jsonb
);
