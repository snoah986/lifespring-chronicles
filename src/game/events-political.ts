import { GameState, GameEvent, NPC } from './types';

let polId = 50000;
function pid(): string {
  return `pol_${polId++}`;
}

function randomName(): string {
  const first = ['Diana', 'Charles', 'Helena', 'Victor', 'Constance', 'Edmund', 'Miriam', 'Roland'];
  const last = ['Ashworth', 'Brennan', 'Calder', 'Dunmore', 'Everett', 'Fairfax', 'Grantham', 'Harlow'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

/**
 * The Political Path fork event. Fires at age 21-25 if not already on a path.
 */
export function getPoliticalPathEvent(state: GameState): GameEvent | null {
  if (state.careerPathChosen) return null;
  if (state.currentAge < 21 || state.currentAge > 25) return null;

  const partyContactNPC: NPC = {
    id: pid(),
    name: randomName(),
    birthYear: state.birthYear - 12,
    relationship: 'political_ally',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };

  return {
    id: pid(),
    title: 'The Political Call',
    description: `${partyContactNPC.name}, a local party figure, approaches you after a community meeting. They've been watching you — the way you speak, how people respond to you. They think you have something. There's a local council seat coming up that needs a candidate. This is how it starts.`,
    minAge: state.currentAge, maxAge: state.currentAge,
    stage: ['young_adult'],
    choices: [
      {
        id: pid(),
        text: 'Accept the candidacy — you have things you want to change',
        effects: { reputation: 10, happiness: 5, approvalRating: 40, coalitionStability: 60 } as any,
        chronicleText: `You said yes to ${partyContactNPC.name}. The machine started turning. You were in now.`,
        valence: 'positive',
        npcInteraction: { npcId: partyContactNPC.id, type: 'accepted_candidacy', severity: 9, domain: 'political' },
        setsPoliticalPath: true,
      },
      {
        id: pid(),
        text: 'Decline — the timing isn\'t right',
        effects: { karma: 2 },
        chronicleText: `You told ${partyContactNPC.name} you weren't ready. They nodded, but the opportunity quietly passed.`,
        valence: 'neutral',
        npcInteraction: { npcId: partyContactNPC.id, type: 'declined_candidacy', severity: 5, domain: 'political' },
      },
    ],
    ...(({ _newNPC: partyContactNPC } as any)),
  };
}

/**
 * Events for the Political path — approval, coalition, scandal.
 */
export function generatePoliticalEvents(state: GameState): { events: GameEvent[]; newNPCs: Map<string, NPC> } {
  const events: GameEvent[] = [];
  const newNPCs = new Map<string, NPC>();

  // Event 1: Local Election
  const opponentNPC: NPC = {
    id: pid(),
    name: randomName(),
    birthYear: state.birthYear - 3,
    relationship: 'political_rival',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(opponentNPC.id, opponentNPC);

  events.push({
    id: pid(),
    title: 'Local Election',
    description: `Your first election. ${opponentNPC.name} is your opponent — more experienced, better funded, but slightly out of touch with local concerns. You have youth, energy, and a message. How do you run this campaign?`,
    minAge: 22, maxAge: 30,
    stage: ['young_adult', 'adult'],
    choices: [
      {
        id: pid(),
        text: 'Run a clean, issues-led campaign',
        effects: { approvalRating: 15, reputation: 12, coalitionStability: 10, karma: 8 } as any,
        chronicleText: `You won on the issues. ${opponentNPC.name} conceded gracefully. Your majority was modest but real.`,
        valence: 'positive',
        npcInteraction: { npcId: opponentNPC.id, type: 'clean_campaign_victory', severity: 8, domain: 'political' },
      },
      {
        id: pid(),
        text: 'Go negative — expose their record aggressively',
        effects: { approvalRating: 10, reputation: 5, coalitionStability: -10, karma: -8 } as any,
        chronicleText: `The attacks worked. You won, but ${opponentNPC.name} was not the only one with wounds.`,
        valence: 'neutral',
        npcInteraction: { npcId: opponentNPC.id, type: 'negative_campaign', severity: 9, domain: 'political' },
      },
      {
        id: pid(),
        text: 'Concede early if polling looks bad — preserve yourself for a bigger run',
        effects: { approvalRating: -10, karma: 3, reputation: -5 } as any,
        chronicleText: `You read the numbers and stepped aside early. ${opponentNPC.name} won comfortably. You lived to fight another day.`,
        valence: 'neutral',
        npcInteraction: { npcId: opponentNPC.id, type: 'conceded', severity: 6, domain: 'political' },
      },
    ],
  });

  // Event 2: Scandal Management
  events.push({
    id: pid(),
    title: 'The Scandal',
    description: 'A journalist has found something from your past — nothing criminal, but politically damaging. They\'re running the story tomorrow morning. Your team is panicking. You have one night to decide how to respond.',
    minAge: 26, maxAge: 45,
    stage: ['adult'],
    choices: [
      {
        id: pid(),
        text: 'Get ahead of it — release a full, honest statement tonight',
        effects: { approvalRating: 5, reputation: 8, karma: 10, coalitionStability: 5 } as any,
        chronicleText: 'You owned it completely. The transparency was disarming. Most people respected you more for it.',
        valence: 'positive',
      },
      {
        id: pid(),
        text: 'Deny, delay, and discredit the journalist',
        effects: { approvalRating: -10, karma: -12, coalitionStability: -15 } as any,
        chronicleText: 'The denial held for a week. Then it unravelled. The cover-up was worse than the story.',
        valence: 'negative',
      },
      {
        id: pid(),
        text: 'Say nothing and let your allies defend you',
        effects: { approvalRating: -5, coalitionStability: -8 } as any,
        chronicleText: 'Your silence was read as guilt by some, dignity by others. The coalition took the strain.',
        valence: 'neutral',
      },
    ],
  });

  // Event 3: Policy Vote
  events.push({
    id: pid(),
    title: 'The Conscience Vote',
    description: 'A controversial policy vote is coming. Your party whips are demanding loyalty. Your constituents are split. Your own conscience points in a third direction entirely.',
    minAge: 28, maxAge: 50,
    stage: ['adult', 'mid_life'],
    choices: [
      {
        id: pid(),
        text: 'Vote with the party — loyalty keeps your position',
        effects: { coalitionStability: 10, approvalRating: -8, karma: -5 } as any,
        chronicleText: 'You voted with the whips. Your position was secure. But you knew what you\'d traded.',
        valence: 'neutral',
      },
      {
        id: pid(),
        text: 'Vote your conscience — regardless of consequences',
        effects: { approvalRating: 12, karma: 15, coalitionStability: -15, reputation: 10 } as any,
        chronicleText: 'You voted against the party line. Some called it principle. Others called it suicide. Both were right.',
        valence: 'positive',
      },
      {
        id: pid(),
        text: 'Abstain — refuse to be forced into either camp',
        effects: { approvalRating: -3, coalitionStability: -5, reputation: 5 } as any,
        chronicleText: 'You abstained. It satisfied no one, but it was honest.',
        valence: 'neutral',
      },
    ],
  });

  // Event 4: Party Betrayal
  const partyAllyNPC: NPC = {
    id: pid(),
    name: randomName(),
    birthYear: state.birthYear - 8,
    relationship: 'political_ally',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(partyAllyNPC.id, partyAllyNPC);

  events.push({
    id: pid(),
    title: 'Party Betrayal',
    description: `${partyAllyNPC.name} — someone you brought up, mentored, and defended — is mounting a leadership challenge against you with the backing of half your coalition. The knife is in, and they're the one holding it.`,
    minAge: 35, maxAge: 55,
    stage: ['adult', 'mid_life'],
    choices: [
      {
        id: pid(),
        text: 'Fight for your position — call their bluff',
        effects: { approvalRating: 5, coalitionStability: -20, health: -5, karma: 3 } as any,
        chronicleText: `You fought. The vote was brutal. You survived, but ${partyAllyNPC.name} split the party permanently.`,
        valence: 'neutral',
        npcInteraction: { npcId: partyAllyNPC.id, type: 'survived_challenge', severity: 10, domain: 'political' },
      },
      {
        id: pid(),
        text: 'Step aside with dignity — control the narrative',
        effects: { reputation: 12, karma: 10, approvalRating: -10, happiness: -8 } as any,
        chronicleText: `You announced your resignation before they could force it. History remembered your grace. ${partyAllyNPC.name} got what they wanted. So did you, in a different way.`,
        valence: 'positive',
        npcInteraction: { npcId: partyAllyNPC.id, type: 'resigned_with_dignity', severity: 9, domain: 'political' },
      },
      {
        id: pid(),
        text: 'Destroy them — leak everything you know',
        effects: { coalitionStability: -30, karma: -15, reputation: -10 } as any,
        chronicleText: `You burned ${partyAllyNPC.name} to the ground. The whole party caught fire in the process.`,
        valence: 'negative',
        npcInteraction: { npcId: partyAllyNPC.id, type: 'destroyed_rival', severity: 10, domain: 'political' },
      },
    ],
  });

  return {
    events: events.filter(e => state.currentAge >= e.minAge && state.currentAge <= e.maxAge),
    newNPCs,
  };
}
