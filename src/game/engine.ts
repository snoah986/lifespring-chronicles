import { GameState, NPC, GameEvent, ActiveEvent, ChronicleEntry, EventChoice, getLifeStage, Interaction } from './types';
import { checkReappearance } from './reappearance';
import { generateDeepAdolescenceEvents } from './events-adolescence';
import { getMandatoryExamEvent, generateSchoolLifeEvents } from './events-education';
import { getCareerForkEvent, generateCareerEvents } from './events-career';
import { getCriminalPathEvent, generateCriminalEvents } from './events-criminal';
import { getPoliticalPathEvent, generatePoliticalEvents } from './events-political';

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
    careerTitle: 'Student',
    annualSalary: 0,
    universityLocked: false,
    careerPathChosen: false,
    criminalPath: false,
    politicalPath: false,
    academicIntelligence: 50,
    streetReputation: 0,
    policeHeat: 0,
    approvalRating: 0,
    coalitionStability: 0,
    examsTaken: [],
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
          chronicleText: `You reported the bullying to a teacher. ${friend.name} wished you'd been braver.`,
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
      description: `There's a big test tomorrow. ${classmate.name} asks if you want to study together, but you could also play outside.`,
      minAge: 6, maxAge: 11,
      stage: ['childhood'],
      choices: [
        {
          id: uid(),
          text: `Study with ${classmate.name}`,
          effects: { reputation: 5, happiness: -3, karma: 3, academicIntelligence: 5 },
          chronicleText: `You studied hard with ${classmate.name}. You both aced the test.`,
          valence: 'positive',
          npcInteraction: { npcId: classmate.id, type: 'studied_together', severity: 4, domain: 'academic' },
        },
        {
          id: uid(),
          text: 'Go play outside instead',
          effects: { happiness: 8, reputation: -3, karma: -2, academicIntelligence: -3 },
          chronicleText: 'You chose fun over studying. The test didn\'t go well.',
          valence: 'neutral',
        },
      ],
    });
  }

  if (sibling) {
    events.push({
      id: uid(),
      title: 'Sibling Rivalry',
      description: `${sibling.name} broke your favourite toy. They say it was an accident.`,
      minAge: 5, maxAge: 10,
      stage: ['childhood'],
      choices: [
        {
          id: uid(),
          text: 'Forgive them — accidents happen',
          effects: { happiness: 3, karma: 8 },
          chronicleText: `You forgave ${sibling.name}. They hugged you.`,
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
          chronicleText: `${sibling.name} had to apologise.`,
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
    description: 'A group of popular kids invites you to skip class and hang out behind the school.',
    minAge: 13, maxAge: 17,
    stage: ['adolescence'],
    choices: [
      {
        id: uid(),
        text: 'Join them — you want to fit in',
        effects: { happiness: 5, reputation: 5, karma: -5, health: -3, academicIntelligence: -5 },
        chronicleText: 'You skipped class with the popular crowd. It felt thrilling but hollow.',
        valence: 'neutral',
      },
      {
        id: uid(),
        text: 'Decline and head to class',
        effects: { reputation: -3, karma: 5, academicIntelligence: 3 },
        chronicleText: 'You chose your own path.',
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
          chronicleText: `You kept ${friend.name}'s secret and stood by them.`,
          valence: 'positive',
          npcInteraction: { npcId: friend.id, type: 'kept_secret', severity: 9, domain: 'social' },
        },
        {
          id: uid(),
          text: 'Tell a trusted adult — they need real help',
          effects: { karma: 5, reputation: -5 },
          chronicleText: `You broke ${friend.name}'s trust to get them help. They were angry at first.`,
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

  const newRomance: NPC = {
    id: uid(),
    name: randomName(),
    birthYear: state.birthYear + Math.floor(Math.random() * 4) - 2,
    relationship: 'romantic',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };

  const romanceEvent: GameEvent = {
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
  };
  (romanceEvent as any)._newNPC = newRomance;
  events.push(romanceEvent);

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

  const officeEvent: GameEvent = {
    id: uid(),
    title: 'Office Politics',
    description: `Your colleague ${newColleague.name} takes credit for your work in a meeting.`,
    minAge: 26, maxAge: 45,
    stage: ['adult'],
    choices: [
      {
        id: uid(),
        text: 'Confront them privately',
        effects: { reputation: 5, happiness: -3, karma: 5 },
        chronicleText: `You confronted ${newColleague.name}. They apologised, but the tension remained.`,
        valence: 'neutral',
        npcInteraction: { npcId: newColleague.id, type: 'confronted', severity: 6, domain: 'professional' },
      },
      {
        id: uid(),
        text: 'Let it go — your work will speak for itself',
        effects: { karma: 8, reputation: -3 },
        chronicleText: 'You chose the high road.',
        valence: 'neutral',
      },
      {
        id: uid(),
        text: 'Report them to your boss with evidence',
        effects: { reputation: 8, karma: 2, happiness: -5 },
        chronicleText: `${newColleague.name} was reprimanded.`,
        valence: 'positive',
        npcInteraction: { npcId: newColleague.id, type: 'reported', severity: 8, domain: 'professional' },
      },
    ],
  };
  (officeEvent as any)._newNPC = newColleague;
  events.push(officeEvent);

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
        effects: { health: -15, karma: -3 },
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
        chronicleText: 'Regret crept in during the quiet hours.',
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
    case 'childhood': {
      events = generateChildhoodEvents(state);
      const school = generateSchoolLifeEvents(state);
      events = [...events, ...school.events];
      school.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      break;
    }
    case 'adolescence': {
      events = generateAdolescenceEvents(state);
      const deep = generateDeepAdolescenceEvents(state);
      events = [...events, ...deep.events];
      deep.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      const school = generateSchoolLifeEvents(state);
      events = [...events, ...school.events];
      school.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      // Criminal path entry
      if (!state.careerPathChosen) {
        const crimEvent = getCriminalPathEvent(state);
        if (crimEvent) events.push(crimEvent);
      }
      break;
    }
    case 'young_adult': {
      events = generateYoungAdultEvents(state);
      const deep = generateDeepAdolescenceEvents(state);
      events = [...events, ...deep.events];
      deep.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      // Career fork
      if (!state.careerPathChosen) {
        const careerFork = getCareerForkEvent(state);
        if (careerFork) events.push(careerFork);
        const polEvent = getPoliticalPathEvent(state);
        if (polEvent) events.push(polEvent);
      }
      // Path-specific events
      if (state.criminalPath) {
        const crim = generateCriminalEvents(state);
        events = [...events, ...crim.events];
        crim.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      }
      if (state.politicalPath) {
        const pol = generatePoliticalEvents(state);
        events = [...events, ...pol.events];
        pol.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      }
      if (state.careerPathChosen && !state.criminalPath && !state.politicalPath) {
        const car = generateCareerEvents(state);
        events = [...events, ...car.events];
        car.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      }
      break;
    }
    case 'adult': {
      events = generateAdultEvents(state);
      if (state.criminalPath) {
        const crim = generateCriminalEvents(state);
        events = [...events, ...crim.events];
        crim.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      } else if (state.politicalPath) {
        const pol = generatePoliticalEvents(state);
        events = [...events, ...pol.events];
        pol.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      } else if (state.careerPathChosen) {
        const car = generateCareerEvents(state);
        events = [...events, ...car.events];
        car.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      }
      break;
    }
    case 'mid_life': {
      events = generateMidLifeEvents(state);
      if (state.politicalPath) {
        const pol = generatePoliticalEvents(state);
        events = [...events, ...pol.events];
        pol.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
      }
      break;
    }
    case 'elder': events = generateElderEvents(state); break;
    case 'late_life': events = generateLateLifeEvents(state); break;
  }

  return {
    events: events.filter(e => state.currentAge >= e.minAge && state.currentAge <= e.maxAge),
    newNPCs: allNewNPCs,
  };
}

function checkDeath(state: GameState): boolean {
  if (state.currentAge < 50) return false;
  const baseChance = (state.currentAge - 50) * 0.02;
  const healthMod = (100 - state.stats.health) * 0.005;
  // High police heat increases death chance
  const heatMod = state.criminalPath ? state.policeHeat * 0.001 : 0;
  return Math.random() < (baseChance + healthMod + heatMod);
}

export function selectEventForAge(state: GameState): GameState {
  // Check for mandatory exam first
  const examEvent = getMandatoryExamEvent(state);
  if (examEvent) {
    return {
      ...state,
      currentEvent: {
        event: examEvent,
        involvedNPCs: [],
      },
    };
  }

  const { events, newNPCs } = getEventsForAge(state);
  if (events.length === 0) return state;

  // Prioritise mandatory events (career fork, path events)
  const mandatory = events.filter(e => e.isMandatory);
  const pool = mandatory.length > 0 ? mandatory : events;
  const event = pool[Math.floor(Math.random() * pool.length)];

  let npcs = [...state.npcs];
  const legacyNPC = (event as any)._newNPC as NPC | undefined;
  if (legacyNPC && !npcs.find(n => n.id === legacyNPC.id)) {
    npcs = [...npcs, legacyNPC];
  }
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

  if (choice.effects.health !== undefined) newStats.health = clamp(newStats.health + choice.effects.health, 0, 100);
  if (choice.effects.happiness !== undefined) newStats.happiness = clamp(newStats.happiness + choice.effects.happiness, 0, 100);
  if (choice.effects.money !== undefined) newStats.money = clamp(newStats.money + choice.effects.money, 0, 100);
  if (choice.effects.reputation !== undefined) newStats.reputation = clamp(newStats.reputation + choice.effects.reputation, 0, 100);
  if (choice.effects.karma !== undefined) newStats.karma = clamp(newStats.karma + choice.effects.karma, -100, 100);

  // Hidden stats
  let academicIntelligence = state.academicIntelligence;
  let streetReputation = state.streetReputation;
  let policeHeat = state.policeHeat;
  let approvalRating = state.approvalRating;
  let coalitionStability = state.coalitionStability;
  let annualSalary = state.annualSalary;

  if (choice.effects.academicIntelligence !== undefined)
    academicIntelligence = clamp(academicIntelligence + choice.effects.academicIntelligence, 0, 100);
  if (choice.effects.streetReputation !== undefined)
    streetReputation = clamp(streetReputation + choice.effects.streetReputation, 0, 100);
  if (choice.effects.policeHeat !== undefined)
    policeHeat = clamp(policeHeat + choice.effects.policeHeat, 0, 100);
  if (choice.effects.approvalRating !== undefined)
    approvalRating = clamp(approvalRating + choice.effects.approvalRating, 0, 100);
  if (choice.effects.coalitionStability !== undefined)
    coalitionStability = clamp(coalitionStability + choice.effects.coalitionStability, 0, 100);
  if (choice.effects.annualSalary !== undefined)
    annualSalary = Math.max(0, annualSalary + choice.effects.annualSalary);

  // Career / path flags
  let career = state.career;
  let careerTitle = state.careerTitle;
  let careerPathChosen = state.careerPathChosen;
  let criminalPath = state.criminalPath;
  let politicalPath = state.politicalPath;
  let universityLocked = state.universityLocked;
  let examsTaken = [...state.examsTaken];

  if (choice.setsCareer) {
    career = choice.setsCareer;
    careerTitle = choice.setsCareer;
    careerPathChosen = true;
  }
  if (choice.setsCriminalPath) {
    criminalPath = true;
    careerPathChosen = true;
    careerTitle = 'Street';
  }
  if (choice.setsPoliticalPath) {
    politicalPath = true;
    careerPathChosen = true;
    careerTitle = 'Politician';
  }
  if (choice.locksUniversity) {
    universityLocked = true;
  }

  // Mark exam as taken
  const examAges = [11, 16, 18];
  if (examAges.includes(state.currentAge) && !examsTaken.includes(state.currentAge)) {
    examsTaken.push(state.currentAge);
  }

  // NPC interactions
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
    career,
    careerTitle,
    careerPathChosen,
    criminalPath,
    politicalPath,
    universityLocked,
    examsTaken,
    academicIntelligence,
    streetReputation,
    policeHeat,
    approvalRating,
    coalitionStability,
    annualSalary,
  };
}

export function advanceYear(state: GameState): GameState {
  if (state.currentEvent) return state;

  const newAge = state.currentAge + 1;
  let newState = { ...state, currentAge: newAge };

  // Passive salary income every year
  if (newState.annualSalary > 0) {
    newState.stats = {
      ...newState.stats,
      money: clamp(newState.stats.money + Math.floor(newState.annualSalary / 10), 0, 100),
    };
  }

  // Natural health drift after 50
  if (newAge > 50) {
    newState.stats = {
      ...newState.stats,
      health: clamp(newState.stats.health - Math.floor(Math.random() * 3), 0, 100),
    };
  }

  // Police heat slowly fades
  if (newState.policeHeat > 0) {
    newState = { ...newState, policeHeat: Math.max(0, newState.policeHeat - 2) };
  }

  // Check for death
  if (checkDeath(newState)) {
    const karma = newState.stats.karma;
    const epitaph = karma > 30
      ? 'They left the world better than they found it.'
      : karma < -30
      ? 'Their legacy was complicated, their story unfinished.'
      : 'They lived a full life, with all its contradictions.';

    const deathEntry: ChronicleEntry = {
      age: newAge,
      text: `${state.playerName} passed away at age ${newAge}. ${epitaph}`,
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
