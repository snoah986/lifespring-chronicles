import { GameState, NPC, Interaction, GameEvent, EventChoice, ChronicleEntry } from './types';

let reappearanceId = 10000;
function ruid(): string {
  return `reap_${reappearanceId++}`;
}

interface ReappearanceCandidate {
  npc: NPC;
  interaction: Interaction;
  yearsElapsed: number;
  probability: number;
}

/**
 * Scans all NPCs for past high-severity interactions that qualify
 * for a reappearance event. Rules:
 * - Only interactions with severity >= 7
 * - Must be at least 5 in-game years since the interaction
 * - Probability scales with severity, time elapsed, and domain alignment
 */
export function scanForReappearances(state: GameState): ReappearanceCandidate[] {
  const candidates: ReappearanceCandidate[] = [];

  for (const npc of state.npcs) {
    if (!npc.alive) continue;

    for (const interaction of npc.interactions) {
      if (interaction.severity < 7) continue;

      const yearsElapsed = state.currentAge - interaction.playerAge;
      if (yearsElapsed < 5) continue;

      // Already generated a reappearance for this exact interaction?
      // Check if chronicle already mentions this NPC at a later age with "reappears"
      const alreadyTriggered = state.chronicle.some(
        c => c.age > interaction.playerAge && c.text.includes(npc.name) && c.text.includes('reappear')
      );
      if (alreadyTriggered) continue;

      // Calculate probability: base from severity, boosted by time, slight domain variance
      const severityFactor = (interaction.severity - 6) * 0.1; // 0.1 to 0.4
      const timeFactor = Math.min(yearsElapsed * 0.02, 0.3); // caps at 0.3
      const randomNoise = (Math.random() - 0.5) * 0.1; // -0.05 to 0.05
      const probability = Math.min(severityFactor + timeFactor + randomNoise, 0.6);

      if (Math.random() < probability) {
        candidates.push({ npc, interaction, yearsElapsed, probability });
      }
    }
  }

  return candidates;
}

/**
 * Given a reappearance candidate, generates a contextual event
 * whose tone and outcome are influenced by the original interaction's
 * valence, but with randomness to prevent deterministic outcomes.
 */
export function resolveReappearance(
  state: GameState,
  candidate: ReappearanceCandidate
): { event: GameEvent; chronicle?: ChronicleEntry } {
  const { npc, interaction } = candidate;
  const wasPositive = interaction.valence === 'positive';
  const wasNegative = interaction.valence === 'negative';

  // Domain-appropriate context for the reappearance
  const contexts = getReappearanceContexts(npc, interaction, state);

  // Slight chance the "expected" outcome flips (20% twist chance)
  const twist = Math.random() < 0.2;

  const choices: EventChoice[] = [];

  if (wasNegative && !twist) {
    // Negative past → confrontation or grudge
    choices.push(
      {
        id: ruid(),
        text: `Apologize to ${npc.name} for what happened`,
        effects: { karma: 12, happiness: 5, reputation: 3 },
        chronicleText: `You apologized to ${npc.name} for the past. ${contexts.reconcileOutcome}`,
        valence: 'positive',
        npcInteraction: { npcId: npc.id, type: 'apologized', severity: 6, domain: interaction.domain },
      },
      {
        id: ruid(),
        text: `Ignore them — the past is the past`,
        effects: { karma: -3, happiness: -2 },
        chronicleText: `You saw ${npc.name} but chose to look away. The weight of history hung in the air.`,
        valence: 'negative',
        npcInteraction: { npcId: npc.id, type: 'ignored', severity: 4, domain: interaction.domain },
      },
      {
        id: ruid(),
        text: `Stand your ground — you had your reasons`,
        effects: { karma: -5, reputation: 3, happiness: -3 },
        chronicleText: `You faced ${npc.name} without regret. ${contexts.standGroundOutcome}`,
        valence: 'neutral',
        npcInteraction: { npcId: npc.id, type: 'stood_ground', severity: 5, domain: interaction.domain },
      }
    );
  } else if (wasPositive && !twist) {
    // Positive past → reward or returned favor
    choices.push(
      {
        id: ruid(),
        text: `Embrace the reunion with ${npc.name}`,
        effects: { happiness: 10, karma: 5, reputation: 5 },
        chronicleText: `${npc.name} reappeared in your life. ${contexts.positiveReunion}`,
        valence: 'positive',
        npcInteraction: { npcId: npc.id, type: 'reunited', severity: 5, domain: interaction.domain },
      },
      {
        id: ruid(),
        text: `Accept their help graciously`,
        effects: { money: 8, karma: 3, happiness: 5 },
        chronicleText: `${npc.name} returned a long-overdue favor. ${contexts.favorReturned}`,
        valence: 'positive',
        npcInteraction: { npcId: npc.id, type: 'favor_returned', severity: 4, domain: interaction.domain },
      }
    );
  } else {
    // Twist or neutral: unpredictable encounter
    choices.push(
      {
        id: ruid(),
        text: `Hear ${npc.name} out`,
        effects: { karma: 5, happiness: twist ? -3 : 5 },
        chronicleText: `${npc.name} reappeared unexpectedly. ${contexts.twistOutcome}`,
        valence: twist ? 'neutral' : 'positive',
        npcInteraction: { npcId: npc.id, type: 'reconnected', severity: 5, domain: interaction.domain },
      },
      {
        id: ruid(),
        text: `Keep your distance`,
        effects: { karma: -2, happiness: 2 },
        chronicleText: `You kept ${npc.name} at arm's length. Some chapters are better left closed.`,
        valence: 'neutral',
        npcInteraction: { npcId: npc.id, type: 'distanced', severity: 3, domain: interaction.domain },
      }
    );
  }

  const event: GameEvent = {
    id: ruid(),
    title: `A Face from the Past: ${npc.name}`,
    description: contexts.description,
    minAge: state.currentAge,
    maxAge: state.currentAge,
    stage: [getLifeStageForAge(state.currentAge)],
    choices,
  };

  return { event };
}

function getLifeStageForAge(age: number) {
  if (age <= 11) return 'childhood' as const;
  if (age <= 17) return 'adolescence' as const;
  if (age <= 25) return 'young_adult' as const;
  if (age <= 45) return 'adult' as const;
  if (age <= 60) return 'mid_life' as const;
  if (age <= 80) return 'elder' as const;
  return 'late_life' as const;
}

interface ReappearanceContexts {
  description: string;
  reconcileOutcome: string;
  standGroundOutcome: string;
  positiveReunion: string;
  favorReturned: string;
  twistOutcome: string;
}

function getReappearanceContexts(npc: NPC, interaction: Interaction, state: GameState): ReappearanceContexts {
  const domainContexts: Record<string, ReappearanceContexts> = {
    social: {
      description: `You spot ${npc.name} at a social gathering. It's been years since that moment when you were ${interaction.playerAge}. They've noticed you too.`,
      reconcileOutcome: 'The conversation was healing. Old wounds began to close.',
      standGroundOutcome: 'They walked away, but you saw something flicker in their eyes.',
      positiveReunion: 'The years melted away as you reconnected over shared memories.',
      favorReturned: 'They remembered your kindness and wanted to pay it forward.',
      twistOutcome: 'The encounter took an unexpected turn — nothing is ever quite as you remember.',
    },
    academic: {
      description: `${npc.name} is giving a talk at a conference you're attending. You remember them from your school days, when you were just ${interaction.playerAge}.`,
      reconcileOutcome: 'Over coffee, you rebuilt what time had eroded.',
      standGroundOutcome: 'You exchanged polite nods but the old tension was palpable.',
      positiveReunion: 'They credited you in their speech. You were stunned.',
      favorReturned: 'They offered you an opportunity — a debt they\'d long wanted to repay.',
      twistOutcome: 'Their success made you question your own choices.',
    },
    family: {
      description: `A family event brings you face to face with ${npc.name}. The last significant moment between you was when you were ${interaction.playerAge}. Time has changed you both.`,
      reconcileOutcome: 'Blood proved thicker than grudges. You embraced.',
      standGroundOutcome: 'The family dinner was tense, but you held your composure.',
      positiveReunion: 'Family bonds, once strengthened, proved resilient across the years.',
      favorReturned: 'They showed up when you needed family most.',
      twistOutcome: 'Family always finds a way to surprise you, for better or worse.',
    },
    professional: {
      description: `${npc.name} walks into your workplace. They're now in a position of influence. Your shared history from age ${interaction.playerAge} hangs in the air.`,
      reconcileOutcome: 'A professional handshake sealed a personal truce.',
      standGroundOutcome: 'The meeting was cordial but guarded on both sides.',
      positiveReunion: 'They remembered your integrity and offered a partnership.',
      favorReturned: 'A recommendation letter from them opened doors you didn\'t expect.',
      twistOutcome: 'The power dynamic had shifted. Nothing felt the same.',
    },
    romantic: {
      description: `You run into ${npc.name} unexpectedly. The last time you truly connected was at age ${interaction.playerAge}. Time has been kind to them.`,
      reconcileOutcome: 'Over a long conversation, you found closure — and maybe something more.',
      standGroundOutcome: 'You smiled politely, but your heart remembered everything.',
      positiveReunion: 'The spark was still there, undimmed by the passage of years.',
      favorReturned: 'They thanked you for the way you treated them. It meant more than you knew.',
      twistOutcome: 'Seeing them stirred feelings you thought you\'d buried long ago.',
    },
    financial: {
      description: `${npc.name} contacts you about a business matter. You haven't spoken since that incident when you were ${interaction.playerAge}.`,
      reconcileOutcome: 'A fair deal was struck, mending old financial wounds.',
      standGroundOutcome: 'You declined their offer. Trust, once broken, is hard to rebuild.',
      positiveReunion: 'Their success was partly thanks to you, and they wanted you to share in it.',
      favorReturned: 'They repaid an old debt with generous interest.',
      twistOutcome: 'Money has a way of complicating even the simplest relationships.',
    },
  };

  return domainContexts[interaction.domain] || domainContexts.social;
}

/**
 * Main function called during advanceYear.
 * Returns a reappearance event if one triggers, or null.
 */
export function checkReappearance(state: GameState): GameEvent | null {
  const candidates = scanForReappearances(state);
  if (candidates.length === 0) return null;

  // Pick the strongest candidate
  const best = candidates.reduce((a, b) => a.probability > b.probability ? a : b);
  const { event } = resolveReappearance(state, best);
  return event;
}
