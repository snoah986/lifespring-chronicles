import { GameState, GameEvent, NPC } from './types';

let criId = 40000;
function crid(): string {
  return `cri_${criId++}`;
}

function randomName(): string {
  const first = ['Razor', 'Nico', 'Lena', 'Dex', 'Mona', 'Ghost', 'Tasha', 'Silk'];
  const last = ['Vega', 'Cross', 'Moran', 'Stone', 'Bell', 'Drake', 'Quinn', 'Nash'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

/**
 * The Criminal Path fork event. Fires at age 17-19 if not already on a path.
 */
export function getCriminalPathEvent(state: GameState): GameEvent | null {
  if (state.careerPathChosen) return null;
  if (state.currentAge < 17 || state.currentAge > 19) return null;

  const crewLeaderNPC: NPC = {
    id: crid(),
    name: randomName(),
    birthYear: state.birthYear - 5,
    relationship: 'criminal_contact',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };

  return {
    id: crid(),
    title: 'An Offer from the Street',
    description: `${crewLeaderNPC.name} has been watching you for weeks. They approach you with an offer — real money, real respect, a crew that looks after its own. The streets can give you things school never could. But you know what this door looks like once it opens.`,
    minAge: state.currentAge, maxAge: state.currentAge,
    stage: ['adolescence', 'young_adult'],
    choices: [
      {
        id: crid(),
        text: `Take the offer — you want what ${crewLeaderNPC.name} is describing`,
        effects: { money: 10, reputation: 5, streetReputation: 15, karma: -10 } as any,
        chronicleText: `You shook ${crewLeaderNPC.name}'s hand. You knew what you were stepping into.`,
        valence: 'negative',
        npcInteraction: { npcId: crewLeaderNPC.id, type: 'joined_crew', severity: 10, domain: 'criminal' },
        setsCriminalPath: true,
      },
      {
        id: crid(),
        text: 'Walk away — this isn\'t your life',
        effects: { karma: 5, happiness: -3 },
        chronicleText: `You turned ${crewLeaderNPC.name} down. They nodded, unsurprised. The offer wouldn't come again.`,
        valence: 'positive',
        npcInteraction: { npcId: crewLeaderNPC.id, type: 'declined_crew', severity: 6, domain: 'social' },
      },
    ],
    // We need the NPC to persist — tagged for engine to add
    ...(({ _newNPC: crewLeaderNPC } as any)),
  };
}

/**
 * Events for the Criminal path — street reputation, police heat, loyalty.
 */
export function generateCriminalEvents(state: GameState): { events: GameEvent[]; newNPCs: Map<string, NPC> } {
  const events: GameEvent[] = [];
  const newNPCs = new Map<string, NPC>();

  // Event 1: First Job
  const fenceNPC: NPC = {
    id: crid(),
    name: randomName(),
    birthYear: state.birthYear - 8,
    relationship: 'criminal_contact',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(fenceNPC.id, fenceNPC);

  events.push({
    id: crid(),
    title: 'First Job',
    description: `${fenceNPC.name} lays out a simple job. Low risk, decent payout, clean exit. But something feels off about the timing. You could back out now, or trust the plan.`,
    minAge: 18, maxAge: 22,
    stage: ['young_adult'],
    choices: [
      {
        id: crid(),
        text: 'Run the job — trust the plan',
        effects: { money: 12, streetReputation: 10, policeHeat: 8, karma: -8 } as any,
        chronicleText: `The job went clean. ${fenceNPC.name} was impressed. Word spread quietly.`,
        valence: 'neutral',
        npcInteraction: { npcId: fenceNPC.id, type: 'completed_job', severity: 8, domain: 'criminal' },
      },
      {
        id: crid(),
        text: 'Pull out at the last minute — something feels wrong',
        effects: { streetReputation: -5, happiness: 3, karma: 3 } as any,
        chronicleText: `You pulled out. Your instincts were right — the job went sideways without you. ${fenceNPC.name} was annoyed.`,
        valence: 'positive',
        npcInteraction: { npcId: fenceNPC.id, type: 'abandoned_job', severity: 7, domain: 'criminal' },
      },
    ],
  });

  // Event 2: Territory Dispute
  const rivalCrewNPC: NPC = {
    id: crid(),
    name: randomName(),
    birthYear: state.birthYear - 2,
    relationship: 'rival',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(rivalCrewNPC.id, rivalCrewNPC);

  events.push({
    id: crid(),
    title: 'Territory Dispute',
    description: `${rivalCrewNPC.name} and their crew have started moving into your area. There are three options: negotiate, escalate, or absorb the loss and move.`,
    minAge: 19, maxAge: 28,
    stage: ['young_adult', 'adult'],
    choices: [
      {
        id: crid(),
        text: 'Negotiate — carve up the territory',
        effects: { streetReputation: 5, policeHeat: 0, karma: 3 } as any,
        chronicleText: `You sat down with ${rivalCrewNPC.name}. A deal was struck. Uneasy, but it held.`,
        valence: 'neutral',
        npcInteraction: { npcId: rivalCrewNPC.id, type: 'negotiated_territory', severity: 7, domain: 'criminal' },
      },
      {
        id: crid(),
        text: 'Escalate — show strength',
        effects: { streetReputation: 15, policeHeat: 15, health: -10, karma: -10 } as any,
        chronicleText: `You chose violence. ${rivalCrewNPC.name} backed down, but the police took notice.`,
        valence: 'negative',
        npcInteraction: { npcId: rivalCrewNPC.id, type: 'escalated_conflict', severity: 10, domain: 'criminal' },
      },
      {
        id: crid(),
        text: 'Move on — this ground isn\'t worth it',
        effects: { streetReputation: -8, happiness: 3, policeHeat: -5 } as any,
        chronicleText: 'You ceded the territory. Some called it weakness. You called it survival.',
        valence: 'neutral',
        npcInteraction: { npcId: rivalCrewNPC.id, type: 'conceded_territory', severity: 5, domain: 'criminal' },
      },
    ],
  });

  // Event 3: Police Encounter
  events.push({
    id: crid(),
    title: 'Police Stop',
    description: 'Two officers pull you aside. They don\'t have anything solid — but they\'re fishing. Your street reputation has clearly caught attention. How you handle this will define how both sides see you.',
    minAge: 20, maxAge: 35,
    stage: ['young_adult', 'adult'],
    choices: [
      {
        id: crid(),
        text: 'Say absolutely nothing — no comment, no cooperation',
        effects: { streetReputation: 8, policeHeat: 10, karma: 0 } as any,
        chronicleText: 'You said nothing. They let you go. Your reputation for silence grew.',
        valence: 'neutral',
      },
      {
        id: crid(),
        text: 'Cooperate partially — give them nothing, but stay calm',
        effects: { policeHeat: 5, happiness: 3 } as any,
        chronicleText: 'You were calm, gave them nothing useful, and walked away clean.',
        valence: 'positive',
      },
      {
        id: crid(),
        text: 'Get confrontational',
        effects: { streetReputation: 5, policeHeat: 20, health: -5, happiness: -8 } as any,
        chronicleText: 'You made a scene. They arrested you briefly. The charges didn\'t stick, but the file grew.',
        valence: 'negative',
      },
    ],
  });

  // Event 4: Crew Betrayal
  const traitorNPC: NPC = {
    id: crid(),
    name: randomName(),
    birthYear: state.birthYear + 1,
    relationship: 'criminal_contact',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(traitorNPC.id, traitorNPC);

  events.push({
    id: crid(),
    title: 'The Betrayal',
    description: `You discover ${traitorNPC.name} — someone in your inner circle — has been talking to the police. Not much, but enough. The crew is watching to see what you do.`,
    minAge: 22, maxAge: 38,
    stage: ['young_adult', 'adult'],
    choices: [
      {
        id: crid(),
        text: 'Cut them out quietly — no drama, no violence',
        effects: { streetReputation: 5, karma: 5, policeHeat: -5 } as any,
        chronicleText: `You removed ${traitorNPC.name} from your world without fanfare. The message was clear.`,
        valence: 'neutral',
        npcInteraction: { npcId: traitorNPC.id, type: 'cut_out_informant', severity: 9, domain: 'criminal' },
      },
      {
        id: crid(),
        text: 'Make an example of them',
        effects: { streetReputation: 15, policeHeat: 20, health: -5, karma: -15 } as any,
        chronicleText: `What you did to ${traitorNPC.name} was never spoken about directly. But everyone knew.`,
        valence: 'negative',
        npcInteraction: { npcId: traitorNPC.id, type: 'made_example', severity: 10, domain: 'criminal' },
      },
      {
        id: crid(),
        text: 'Give them a chance to explain themselves',
        effects: { streetReputation: -5, karma: 8 } as any,
        chronicleText: `You gave ${traitorNPC.name} a chance to talk. Their explanation was complicated. Trust, once broken, never fully repairs.`,
        valence: 'neutral',
        npcInteraction: { npcId: traitorNPC.id, type: 'heard_out_traitor', severity: 8, domain: 'criminal' },
      },
    ],
  });

  return {
    events: events.filter(e => state.currentAge >= e.minAge && state.currentAge <= e.maxAge),
    newNPCs,
  };
}
