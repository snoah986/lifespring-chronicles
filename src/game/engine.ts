import { GameState, NPC, GameEvent, ActiveEvent, ChronicleEntry, EventChoice, getLifeStage, Interaction } from './types';
import { checkReappearance } from './reappearance';
import { generateDeepAdolescenceEvents } from './events-adolescence';

let nextId = 1;
function uid(): string {
  return `id_${nextId++}`;
}

const FIRST_NAMES = ['Alex', 'Jordan', 'Sam', 'Morgan', 'Casey', 'Riley', 'Taylor', 'Jamie', 'Quinn', 'Avery', 'Drew', 'Blake', 'Charlie', 'Dakota', 'Emery', 'Finley', 'Harper', 'Kai', 'Lennox', 'Micah'];
const LAST_NAMES = ['Chen', 'Rivera', 'Okafor', 'Johansson', 'Park', 'Nakamura', 'Williams', 'Santos', 'Mueller', 'Singh', 'Kowalski', 'Ahmed', 'Torres', 'Kim', 'Petrov'];

function randomName(): string {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function createInitialState(playerName: string): GameState {
  const birthYear = 1985;
  const siblingName = randomName();
  
  const npcs: NPC[] = [
    {
      id: uid(),
      name: siblingName,
      birthYear: birthYear + Math.floor(Math.random() * 4) - 2,
      relationship: 'family',
      interactions: [],
      alive: true,
      metAtAge: 0,
    },
    {
      id: uid(),
      name: randomName(),
      birthYear: birthYear + Math.floor(Math.random() * 2) - 1,
      relationship: 'classmate',
      interactions: [],
      alive: true,
      metAtAge: 5,
    },
    {
      id: uid(),
      name: randomName(),
      birthYear: birthYear + Math.floor(Math.random() * 2),
      relationship: 'friend',
      interactions: [],
      alive: true,
      metAtAge: 5,
    },
    {
      id: uid(),
      name: randomName(),
      birthYear: birthYear - 20 - Math.floor(Math.random() * 10),
      relationship: 'teacher',
      interactions: [],
      alive: true,
      metAtAge: 5,
    },
  ];

  return {
    phase: 'playing',
    playerName,
    birthYear,
    currentAge: 5,
    stats: {
      health: 80,
      happiness: 75,
      money: 10,
      reputation: 30,
      karma: 0,
    },
    npcs,
    chronicle: [
      { age: 0, text: `${playerName} was born in ${birthYear}.`, valence: 'positive' },
      { age: 0, text: `Your sibling ${siblingName} is part of the family.`, valence: 'neutral' },
      { age: 5, text: 'You start school and meet your first classmates.', valence: 'positive' },
    ],
    currentEvent: null,
    career: 'None',
  };
}

export function getNPCById(state: GameState, id: string): NPC | undefined {
  return state.npcs.find(n => n.id === id);
}

function generateChildhoodEvents(state: GameState): GameEvent[] {
  const friend = state.npcs.find(n => n.relationship === 'friend');
  const classmate = state.npcs.find(n => n.relationship === 'classmate');
  const sibling = state.npcs.find(n => n.relationship === 'family');

  const events: GameEvent[] = [];

  if (friend) {
    events.push({
      id: uid(),
      title: 'Playground Conflict',
      description: `${friend.name} is being picked on by older kids at school. They look at you, hoping for help.`,
      minAge: 5, maxAge: 11,
      stage: ['childhood'],
      choices: [
        {
          id: uid(),
          text: `Stand up for ${friend.name}, even though you're scared`,
          effects: { happiness: 5, reputation: 8, health: -5, karma: 10 },
          chronicleText: `You defended ${friend.name} from bullies. A bruise, but a bond forged.`,
          valence: 'positive',
          npcInteraction: { npcId: friend.id, type: 'defended', severity: 7, domain: 'social' },
        },
        {
          id: uid(),
          text: 'Tell a teacher about what\'s happening',
          effects: { reputation: 3, karma: 5 },
          chronicleText: `You reported the bullying to a teacher. The right thing, but ${friend.name} wished you'd been braver.`,
          valence: 'neutral',
          npcInteraction: { npcId: friend.id, type: 'reported', severity: 4, domain: 'social' },
        },
        {
          id: uid(),
          text: 'Walk away — it\'s not your problem',
          effects: { karma: -8 },
          chronicleText: `You walked away while ${friend.name} was being bullied. They never quite forgot.`,
          valence: 'negative',
          npcInteraction: { npcId: friend.id, type: 'abandoned', severity: 8, domain: 'social' },
        },
      ],
    });
  }

  if (classmate) {
    events.push({
      id: uid(),
      title: 'The Test',
      description: `There's a big test tomorrow. ${classmate.name} asks if you want to study together, but you could also play outside while the weather is nice.`,
      minAge: 6, maxAge: 11,
      stage: ['childhood'],
      choices: [
        {
          id: uid(),
          text: `Study with ${classmate.name}`,
          effects: { reputation: 5, happiness: -3, karma: 3 },
          chronicleText: `You studied hard with ${classmate.name}. You both aced the test.`,
          valence: 'positive',
          npcInteraction: { npcId: classmate.id, type: 'studied_together', severity: 4, domain: 'academic' },
        },
        {
          id: uid(),
          text: 'Go play outside instead',
          effects: { happiness: 8, reputation: -3, karma: -2 },
          chronicleText: 'You chose fun over studying. The test didn\'t go well, but the sunset was beautiful.',
          valence: 'neutral',
        },
      ],
    });
  }

  if (sibling) {
    events.push({
      id: uid(),
      title: 'Sibling Rivalry',
      description: `${sibling.name} broke your favorite toy. They say it was an accident, but you're not sure.`,
      minAge: 5, maxAge: 10,
      stage: ['childhood'],
      choices: [
        {
          id: uid(),
          text: 'Forgive them — accidents happen',
          effects: { happiness: 3, karma: 8 },
          chronicleText: `You forgave ${sibling.name}. They hugged you and promised to be more careful.`,
          valence: 'positive',
          npcInteraction: { npcId: sibling.id, type: 'forgave', severity: 5, domain: 'family' },
        },
        {
          id: uid(),
          text: 'Get angry and break something of theirs',
          effects: { happiness: -5, karma: -10, reputation: -3 },
          chronicleText: `You retaliated against ${sibling.name}. Both of you got in trouble.`,
          valence: 'negative',
          npcInteraction: { npcId: sibling.id, type: 'retaliated', severity: 7, domain: 'family' },
        },
        {
          id: uid(),
          text: 'Tell your parents',
          effects: { karma: 2 },
          chronicleText: `You told your parents about the broken toy. ${sibling.name} had to apologize.`,
          valence: 'neutral',
          npcInteraction: { npcId: sibling.id, type: 'tattled', severity: 3, domain: 'family' },
        },
      ],
    });
  }

  return events;
}

function generateAdolescenceEvents(state: GameState): GameEvent[] {
  const friend = state.npcs.find(n => n.relationship === 'friend');
  const events: GameEvent[] = [];

  events.push({
    id: uid(),
    title: 'Identity Crisis',
    description: 'You\'re figuring out who you are. A group of popular kids invites you to skip class and hang out behind the school.',
    minAge: 13, maxAge: 17,
    stage: ['adolescence'],
    choices: [
      {
        id: uid(),
        text: 'Join them — you want to fit in',
        effects: { happiness: 5, reputation: 5, karma: -5, health: -3 },
        chronicleText: 'You skipped class with the popular crowd. It felt thrilling but hollow.',
        valence: 'neutral',
      },
      {
        id: uid(),
        text: 'Decline and head to class',
        effects: { reputation: -3, karma: 5 },
        chronicleText: 'You chose your own path. Not everyone understood, but you felt right about it.',
        valence: 'positive',
      },
    ],
  });

  if (friend) {
    events.push({
      id: uid(),
      title: 'A Friend\'s Secret',
      description: `${friend.name} confides in you about a serious problem at home. They make you promise not to tell anyone.`,
      minAge: 14, maxAge: 17,
      stage: ['adolescence'],
      choices: [
        {
          id: uid(),
          text: 'Keep the secret and support them',
          effects: { happiness: -5, karma: 8 },
          chronicleText: `You kept ${friend.name}'s secret and stood by them through a difficult time.`,
          valence: 'positive',
          npcInteraction: { npcId: friend.id, type: 'kept_secret', severity: 9, domain: 'social' },
        },
        {
          id: uid(),
          text: 'Tell a trusted adult — they need real help',
          effects: { karma: 5, reputation: -5 },
          chronicleText: `You broke ${friend.name}'s trust to get them help. They were angry at first, but things got better.`,
          valence: 'neutral',
          npcInteraction: { npcId: friend.id, type: 'broke_trust_for_help', severity: 8, domain: 'social' },
        },
        {
          id: uid(),
          text: 'Distance yourself — it\'s too heavy',
          effects: { karma: -10, happiness: 3 },
          chronicleText: `You pulled away when ${friend.name} needed you most. The guilt lingered.`,
          valence: 'negative',
          npcInteraction: { npcId: friend.id, type: 'abandoned', severity: 9, domain: 'social' },
        },
      ],
    });
  }

  return events;
}

function generateYoungAdultEvents(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];
  
  events.push({
    id: uid(),
    title: 'Career Crossroads',
    description: 'You\'ve finished school. It\'s time to decide what to do with your life.',
    minAge: 18, maxAge: 22,
    stage: ['young_adult'],
    choices: [
      {
        id: uid(),
        text: 'Go to university — invest in your future',
        effects: { money: -15, reputation: 10, karma: 3 },
        chronicleText: 'You enrolled in university, ready to learn and grow.',
        valence: 'positive',
      },
      {
        id: uid(),
        text: 'Start working immediately — money matters',
        effects: { money: 15, reputation: 3 },
        chronicleText: 'You entered the workforce early, hungry and determined.',
        valence: 'neutral',
      },
      {
        id: uid(),
        text: 'Travel the world — experience life first',
        effects: { happiness: 15, money: -10, reputation: -3, karma: 5 },
        chronicleText: 'You packed a bag and set off to see the world. The memories would last forever.',
        valence: 'positive',
      },
    ],
  });

  // Romance event
  const newRomance: NPC = {
    id: uid(),
    name: randomName(),
    birthYear: state.birthYear + Math.floor(Math.random() * 4) - 2,
    relationship: 'romantic',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };

  events.push({
    id: uid(),
    title: 'First Love',
    description: `You meet ${newRomance.name} at a gathering. There's an undeniable connection. They ask for your number.`,
    minAge: 18, maxAge: 25,
    stage: ['young_adult'],
    choices: [
      {
        id: uid(),
        text: 'Give them your number — take a chance',
        effects: { happiness: 12, karma: 2 },
        chronicleText: `You gave ${newRomance.name} your number. Something beautiful might be starting.`,
        valence: 'positive',
        npcInteraction: { npcId: newRomance.id, type: 'romantic_interest', severity: 6, domain: 'romantic' },
      },
      {
        id: uid(),
        text: 'Politely decline — you\'re not ready',
        effects: { karma: 1 },
        chronicleText: `You turned down ${newRomance.name}. Maybe the timing wasn't right.`,
        valence: 'neutral',
        npcInteraction: { npcId: newRomance.id, type: 'rejected', severity: 4, domain: 'romantic' },
      },
    ],
  });

  // Store the NPC to be added when this event triggers
  (events[events.length - 1] as any)._newNPC = newRomance;

  return events;
}

function generateAdultEvents(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];

  const newColleague: NPC = {
    id: uid(),
    name: randomName(),
    birthYear: state.birthYear + Math.floor(Math.random() * 10) - 5,
    relationship: 'colleague',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };

  events.push({
    id: uid(),
    title: 'Office Politics',
    description: `Your colleague ${newColleague.name} takes credit for your work in a meeting. Your boss seems impressed with them.`,
    minAge: 26, maxAge: 45,
    stage: ['adult'],
    choices: [
      {
        id: uid(),
        text: 'Confront them privately',
        effects: { reputation: 5, happiness: -3, karma: 5 },
        chronicleText: `You confronted ${newColleague.name} about stealing credit. They apologized, but the tension remained.`,
        valence: 'neutral',
        npcInteraction: { npcId: newColleague.id, type: 'confronted', severity: 6, domain: 'professional' },
      },
      {
        id: uid(),
        text: 'Let it go — your work will speak for itself',
        effects: { karma: 8, reputation: -3 },
        chronicleText: 'You chose the high road. Some noticed your grace, others your silence.',
        valence: 'neutral',
      },
      {
        id: uid(),
        text: 'Report them to your boss with evidence',
        effects: { reputation: 8, karma: 2, happiness: -5 },
        chronicleText: `You provided evidence to your boss. ${newColleague.name} was reprimanded.`,
        valence: 'positive',
        npcInteraction: { npcId: newColleague.id, type: 'reported', severity: 8, domain: 'professional' },
      },
    ],
  });

  (events[events.length - 1] as any)._newNPC = newColleague;

  events.push({
    id: uid(),
    title: 'Health Scare',
    description: 'A routine checkup reveals something concerning. The doctor wants to run more tests.',
    minAge: 35, maxAge: 50,
    stage: ['adult', 'mid_life'],
    choices: [
      {
        id: uid(),
        text: 'Get the tests done immediately',
        effects: { health: 10, money: -10, happiness: -5 },
        chronicleText: 'You took your health seriously. The tests came back clear, but it was a wake-up call.',
        valence: 'positive',
      },
      {
        id: uid(),
        text: 'Put it off — you feel fine',
        effects: { health: -15, money: 0, karma: -3 },
        chronicleText: 'You ignored the doctor\'s advice. A decision you might come to regret.',
        valence: 'negative',
      },
    ],
  });

  return events;
}

function generateMidLifeEvents(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];

  events.push({
    id: uid(),
    title: 'Legacy Question',
    description: 'You look at your life so far and wonder — what will you be remembered for?',
    minAge: 46, maxAge: 60,
    stage: ['mid_life'],
    choices: [
      {
        id: uid(),
        text: 'Volunteer and give back to the community',
        effects: { happiness: 10, reputation: 12, karma: 15, money: -5 },
        chronicleText: 'You began volunteering. The gratitude of strangers filled something money never could.',
        valence: 'positive',
      },
      {
        id: uid(),
        text: 'Focus on building wealth for retirement',
        effects: { money: 15, happiness: -3, karma: -2 },
        chronicleText: 'You doubled down on finances. The numbers grew, but so did the emptiness.',
        valence: 'neutral',
      },
      {
        id: uid(),
        text: 'Reconnect with old friends and family',
        effects: { happiness: 12, karma: 8 },
        chronicleText: 'You reached out to people from your past. Some doors opened, others stayed shut.',
        valence: 'positive',
      },
    ],
  });

  return events;
}

function generateElderEvents(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];

  events.push({
    id: uid(),
    title: 'Retirement',
    description: 'The day has finally come. Your working years are behind you.',
    minAge: 61, maxAge: 70,
    stage: ['elder'],
    choices: [
      {
        id: uid(),
        text: 'Embrace it — you\'ve earned this rest',
        effects: { happiness: 15, health: 5 },
        chronicleText: 'You retired with grace, ready to enjoy the years ahead.',
        valence: 'positive',
      },
      {
        id: uid(),
        text: 'Struggle with the loss of purpose',
        effects: { happiness: -10, health: -5 },
        chronicleText: 'Retirement hit harder than expected. The silence was deafening.',
        valence: 'negative',
      },
    ],
  });

  return events;
}

function generateLateLifeEvents(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];

  events.push({
    id: uid(),
    title: 'Looking Back',
    description: 'You sit quietly, memories flooding in. Was it a life well lived?',
    minAge: 81, maxAge: 100,
    stage: ['late_life'],
    choices: [
      {
        id: uid(),
        text: 'Smile — you have no regrets',
        effects: { happiness: 10, karma: 5 },
        chronicleText: 'You looked back with peace. Every choice made you who you are.',
        valence: 'positive',
      },
      {
        id: uid(),
        text: 'Wonder what could have been different',
        effects: { happiness: -5, karma: -2 },
        chronicleText: 'Regret crept in during the quiet hours. Some wounds never fully heal.',
        valence: 'negative',
      },
    ],
  });

  return events;
}

function getEventsForAge(state: GameState): { events: GameEvent[]; newNPCs: Map<string, NPC> } {
  const stage = getLifeStage(state.currentAge);
  let events: GameEvent[] = [];
  let allNewNPCs = new Map<string, NPC>();

  switch (stage) {
    case 'childhood': events = generateChildhoodEvents(state); break;
    case 'adolescence': {
      events = generateAdolescenceEvents(state);
      const deep = generateDeepAdolescenceEvents(state);
      events = [...events, ...deep.events];
      deep.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      break;
    }
    case 'young_adult': {
      events = generateYoungAdultEvents(state);
      const deep = generateDeepAdolescenceEvents(state);
      events = [...events, ...deep.events];
      deep.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      break;
    }
    case 'adult': events = generateAdultEvents(state); break;
    case 'mid_life': events = generateMidLifeEvents(state); break;
    case 'elder': events = generateElderEvents(state); break;
    case 'late_life': events = generateLateLifeEvents(state); break;
  }

  return { events: events.filter(e => state.currentAge >= e.minAge && state.currentAge <= e.maxAge), newNPCs: allNewNPCs };
}

function checkDeath(state: GameState): boolean {
  if (state.currentAge < 50) return false;
  const baseChance = (state.currentAge - 50) * 0.02;
  const healthMod = (100 - state.stats.health) * 0.005;
  return Math.random() < (baseChance + healthMod);
}

export function selectEventForAge(state: GameState): GameState {
  const { events, newNPCs } = getEventsForAge(state);
  if (events.length === 0) return state;

  const event = events[Math.floor(Math.random() * events.length)];
  
  // Add any new NPCs from events
  let npcs = [...state.npcs];
  const legacyNPC = (event as any)._newNPC as NPC | undefined;
  if (legacyNPC && !npcs.find(n => n.id === legacyNPC.id)) {
    npcs = [...npcs, legacyNPC];
  }
  // Add new NPCs from deep events that are involved in this event
  const involvedIds = event.choices
    .filter(c => c.npcInteraction)
    .map(c => c.npcInteraction!.npcId);
  for (const id of involvedIds) {
    if (newNPCs.has(id) && !npcs.find(n => n.id === id)) {
      npcs = [...npcs, newNPCs.get(id)!];
    }
  }

  return {
    ...state,
    npcs,
    currentEvent: {
      event,
      involvedNPCs: involvedIds,
    },
  };
}

export function applyChoice(state: GameState, choice: EventChoice): GameState {
  const newStats = { ...state.stats };
  
  if (choice.effects.health) newStats.health = clamp(newStats.health + choice.effects.health, 0, 100);
  if (choice.effects.happiness) newStats.happiness = clamp(newStats.happiness + choice.effects.happiness, 0, 100);
  if (choice.effects.money) newStats.money = clamp(newStats.money + choice.effects.money, 0, 100);
  if (choice.effects.reputation) newStats.reputation = clamp(newStats.reputation + choice.effects.reputation, 0, 100);
  if (choice.effects.karma) newStats.karma = clamp(newStats.karma + choice.effects.karma, -100, 100);

  let npcs = [...state.npcs];
  if (choice.npcInteraction) {
    npcs = npcs.map(npc => {
      if (npc.id === choice.npcInteraction!.npcId) {
        const interaction: Interaction = {
          playerAge: state.currentAge,
          type: choice.npcInteraction!.type,
          valence: choice.valence,
          severity: choice.npcInteraction!.severity,
          domain: choice.npcInteraction!.domain,
          description: choice.chronicleText,
        };
        return { ...npc, interactions: [...npc.interactions, interaction] };
      }
      return npc;
    });
  }

  const chronicle: ChronicleEntry = {
    age: state.currentAge,
    text: choice.chronicleText,
    valence: choice.valence,
  };

  return {
    ...state,
    stats: newStats,
    npcs,
    chronicle: [...state.chronicle, chronicle],
    currentEvent: null,
  };
}

export function advanceYear(state: GameState): GameState {
  if (state.currentEvent) return state;

  const newAge = state.currentAge + 1;
  let newState = { ...state, currentAge: newAge };

  // Natural stat drift
  if (newAge > 50) {
    newState.stats = {
      ...newState.stats,
      health: clamp(newState.stats.health - Math.floor(Math.random() * 3), 0, 100),
    };
  }

  // Check for death
  if (checkDeath(newState)) {
    const deathEntry: ChronicleEntry = {
      age: newAge,
      text: `${state.playerName} passed away at age ${newAge}. ${newState.stats.karma > 20 ? 'They left the world better than they found it.' : newState.stats.karma < -20 ? 'Their legacy was complicated.' : 'They lived a full life.'}`,
      valence: 'neutral',
    };
    return {
      ...newState,
      phase: 'dead',
      chronicle: [...newState.chronicle, deathEntry],
    };
  }

  // Check for reappearance events first
  const reappearanceEvent = checkReappearance(newState);
  if (reappearanceEvent) {
    return {
      ...newState,
      currentEvent: {
        event: reappearanceEvent,
        involvedNPCs: reappearanceEvent.choices
          .filter(c => c.npcInteraction)
          .map(c => c.npcInteraction!.npcId),
      },
    };
  }

  // Generate new event
  newState = selectEventForAge(newState);

  // If no event was generated, add a quiet year
  if (!newState.currentEvent) {
    const quietEntries = [
      'A quiet year passes.',
      'Life continues at its own pace.',
      'The seasons change, and so do you.',
      'Another year in the books.',
      'Time moves forward, steady as always.',
    ];
    newState.chronicle = [...newState.chronicle, {
      age: newAge,
      text: quietEntries[Math.floor(Math.random() * quietEntries.length)],
      valence: 'neutral' as const,
    }];
  }

  return newState;
}
