import { GameState, NPC, GameEvent, ChronicleEntry, EventChoice, getLifeStage, Interaction } from './types';
import { CountryCode, CountryConfig, getCountry, getExamAtAge, isSchoolAge } from './countries';
import { checkReappearance } from './reappearance';
import { generateDeepAdolescenceEvents } from './events-adolescence';
import { generateSchoolLifeEvents } from './events-education';
import { getCareerForkEvent, generateCareerEvents } from './events-career';
import { getCriminalPathEvent, generateCriminalEvents } from './events-criminal';
import { getPoliticalPathEvent, generatePoliticalEvents } from './events-political';

let nextId = 1;
function uid(): string { return `id_${nextId++}`; }

const FIRST_NAMES = ['Alex', 'Jordan', 'Sam', 'Morgan', 'Casey', 'Riley', 'Taylor', 'Jamie', 'Quinn', 'Avery', 'Drew', 'Blake', 'Charlie', 'Dakota', 'Emery', 'Finley', 'Harper', 'Kai', 'Lennox', 'Micah'];
const LAST_NAMES = ['Chen', 'Rivera', 'Okafor', 'Johansson', 'Park', 'Nakamura', 'Williams', 'Santos', 'Mueller', 'Singh', 'Kowalski', 'Ahmed', 'Torres', 'Kim', 'Petrov'];

export function randomName(): string {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function getActiveCountry(state: GameState): CountryConfig {
  return getCountry(state.country);
}

export function createInitialState(playerName: string, country: CountryCode): GameState {
  const config = getCountry(country);
  const birthYear = 1990;
  const siblingName = randomName();
  const startAge = config.schoolStages[0]?.startAge ?? 5;

  const npcs: NPC[] = [
    { id: uid(), name: siblingName, birthYear: birthYear + Math.floor(Math.random() * 4) - 2, relationship: 'family', interactions: [], alive: true, metAtAge: 0 },
    { id: uid(), name: randomName(), birthYear: birthYear + Math.floor(Math.random() * 2) - 1, relationship: 'classmate', interactions: [], alive: true, metAtAge: startAge },
    { id: uid(), name: randomName(), birthYear: birthYear + Math.floor(Math.random() * 2), relationship: 'friend', interactions: [], alive: true, metAtAge: startAge },
    { id: uid(), name: randomName(), birthYear: birthYear - 20 - Math.floor(Math.random() * 10), relationship: 'teacher', interactions: [], alive: true, metAtAge: startAge },
  ];

  return {
    phase: 'playing',
    playerName,
    birthYear,
    currentAge: startAge,
    country,
    stats: { health: 80, happiness: 75, money: 10, reputation: 30, karma: 0 },
    npcs,
    chronicle: [
      { age: 0, text: `${playerName} was born in ${birthYear} in ${config.name}.`, valence: 'positive' },
      { age: 0, text: `Your sibling ${siblingName} is part of the family.`, valence: 'neutral' },
      { age: startAge, text: `You start ${config.schoolStages[0]?.name ?? 'school'} and meet your first classmates.`, valence: 'positive' },
    ],
    currentEvent: null,
    career: 'None',
    careerTitle: 'Student',
    annualSalary: 0,
    isEmployed: false,
    universityLocked: false,
    careerPathChosen: false,
    examsTaken: [],
    criminalPath: false,
    politicalPath: false,
    academicIntelligence: 50,
    streetReputation: 0,
    policeHeat: 0,
    approvalRating: 0,
    coalitionStability: 0,
    activeTab: 'life',
  };
}

export function getNPCById(state: GameState, id: string): NPC | undefined {
  return state.npcs.find(n => n.id === id);
}

// ─── Exam system — reads from country config, zero hardcoded country logic ───

export function getMandatoryExamEvent(state: GameState): GameEvent | null {
  if (state.examsTaken.includes(state.currentAge)) return null;
  const config = getActiveCountry(state);
  const exam = getExamAtAge(config, state.currentAge);
  if (!exam) return null;

  const teacher = state.npcs.find(n => n.relationship === 'teacher');
  const isLastExam = config.exams[config.exams.length - 1]?.age === exam.age;

  return {
    id: uid(),
    title: `${exam.name} — Age ${exam.age}`,
    description: exam.description + (teacher ? ` Your ${teacher.name} has prepared you as best they can.` : ''),
    minAge: exam.age, maxAge: exam.age,
    stage: [getLifeStage(exam.age)],
    isMandatory: true,
    choices: [
      {
        id: uid(),
        text: `Study hard and give it everything`,
        effects: { academicIntelligence: 18, happiness: -5, health: -5 },
        chronicleText: `You threw yourself into revision for your ${exam.name}. The results reflected the effort.`,
        valence: 'positive',
        ...(teacher ? { npcInteraction: { npcId: teacher.id, type: 'impressed_teacher', severity: 5, domain: 'academic' as const } } : {}),
      },
      {
        id: uid(),
        text: `Do your best with what you know`,
        effects: { academicIntelligence: 8 },
        chronicleText: `You sat your ${exam.name} and did what you could. A solid, honest result.`,
        valence: 'neutral',
      },
      {
        id: uid(),
        text: isLastExam ? `Barely try — this isn't your path` : `Wing it — revision is for other people`,
        effects: { academicIntelligence: -10, happiness: 5 },
        chronicleText: `You barely prepared for your ${exam.name}. Some doors quietly closed.`,
        valence: 'negative',
        ...(isLastExam ? { locksUniversity: true } : {}),
      },
    ],
  };
}

// ─── Job market — apply for a job, update state ───────────────────────────────

export function applyForJob(state: GameState, tierIndex: number, titleIndex: number): GameState {
  const config = getActiveCountry(state);
  const tier = config.jobTiers[tierIndex];
  if (!tier) return state;

  const title = tier.titles[titleIndex] ?? tier.titles[0];
  const salary = Math.round(tier.baseSalary * config.salaryMultiplier);

  const successChance = calculateJobSuccessChance(state, tier);
  const success = Math.random() < successChance;

  const entry: ChronicleEntry = success
    ? { age: state.currentAge, text: `You were hired as a ${title}. Annual salary: ${config.currencySymbol}${(salary * 1000).toLocaleString()}.`, valence: 'positive' }
    : { age: state.currentAge, text: `You applied for a ${title} position but were unsuccessful.`, valence: 'negative' };

  return {
    ...state,
    careerTitle: success ? title : state.careerTitle,
    annualSalary: success ? salary : state.annualSalary,
    isEmployed: success ? true : state.isEmployed,
    career: success ? tier.label : state.career,
    careerPathChosen: success ? true : state.careerPathChosen,
    stats: {
      ...state.stats,
      happiness: success ? clamp(state.stats.happiness + 8, 0, 100) : clamp(state.stats.happiness - 5, 0, 100),
      reputation: success ? clamp(state.stats.reputation + 5, 0, 100) : state.stats.reputation,
    },
    chronicle: [...state.chronicle, entry],
  };
}

export function quitJob(state: GameState): GameState {
  const entry: ChronicleEntry = {
    age: state.currentAge,
    text: `You quit your job as ${state.careerTitle}. The next chapter is unwritten.`,
    valence: 'neutral',
  };
  return {
    ...state,
    careerTitle: 'Unemployed',
    annualSalary: 0,
    isEmployed: false,
    career: 'None',
    stats: {
      ...state.stats,
      happiness: clamp(state.stats.happiness + 5, 0, 100),
    },
    chronicle: [...state.chronicle, entry],
  };
}

function calculateJobSuccessChance(state: GameState, tier: typeof state extends GameState ? ReturnType<typeof getActiveCountry>['jobTiers'][number] : never): number {
  const academicFactor = Math.min((state.academicIntelligence - tier.minAcademic) / 50, 0.3);
  const reputationFactor = Math.min((state.stats.reputation - tier.minReputation) / 100, 0.2);
  const base = tier.tier === 1 ? 0.75 : tier.tier === 2 ? 0.55 : 0.40;
  return clamp(base + academicFactor + reputationFactor, 0.1, 0.95);
}

// ─── Event generation ─────────────────────────────────────────────────────────

function generateChildhoodEvents(state: GameState): GameEvent[] {
  const friend = state.npcs.find(n => n.relationship === 'friend');
  const classmate = state.npcs.find(n => n.relationship === 'classmate');
  const sibling = state.npcs.find(n => n.relationship === 'family');
  const events: GameEvent[] = [];

  if (friend) {
    events.push({
      id: uid(), title: 'Playground Conflict',
      description: `${friend.name} is being picked on by older kids. They look at you, hoping for help.`,
      minAge: 5, maxAge: 13, stage: ['childhood', 'adolescence'],
      choices: [
        { id: uid(), text: `Stand up for ${friend.name}`, effects: { happiness: 5, reputation: 8, health: -5, karma: 10 }, chronicleText: `You defended ${friend.name}. A bruise, but a bond forged.`, valence: 'positive', npcInteraction: { npcId: friend.id, type: 'defended', severity: 7, domain: 'social' } },
        { id: uid(), text: 'Tell a teacher', effects: { reputation: 3, karma: 5 }, chronicleText: `You reported the bullying. ${friend.name} wished you'd been braver.`, valence: 'neutral', npcInteraction: { npcId: friend.id, type: 'reported', severity: 4, domain: 'social' } },
        { id: uid(), text: 'Walk away', effects: { karma: -8 }, chronicleText: `You walked away. ${friend.name} never quite forgot.`, valence: 'negative', npcInteraction: { npcId: friend.id, type: 'abandoned', severity: 8, domain: 'social' } },
      ],
    });
  }

  if (classmate) {
    events.push({
      id: uid(), title: 'Study Together?',
      description: `${classmate.name} asks if you want to study together before the next test.`,
      minAge: 6, maxAge: 13, stage: ['childhood', 'adolescence'],
      choices: [
        { id: uid(), text: `Study with ${classmate.name}`, effects: { reputation: 5, happiness: -3, karma: 3, academicIntelligence: 5 }, chronicleText: `You studied with ${classmate.name}. You both did well.`, valence: 'positive', npcInteraction: { npcId: classmate.id, type: 'studied_together', severity: 4, domain: 'academic' } },
        { id: uid(), text: 'Go play instead', effects: { happiness: 8, reputation: -3, academicIntelligence: -3 }, chronicleText: 'You chose play over study.', valence: 'neutral' },
      ],
    });
  }

  if (sibling) {
    events.push({
      id: uid(), title: 'Sibling Rivalry',
      description: `${sibling.name} broke your favourite thing. They say it was an accident.`,
      minAge: 5, maxAge: 12, stage: ['childhood'],
      choices: [
        { id: uid(), text: 'Forgive them', effects: { happiness: 3, karma: 8 }, chronicleText: `You forgave ${sibling.name}.`, valence: 'positive', npcInteraction: { npcId: sibling.id, type: 'forgave', severity: 5, domain: 'family' } },
        { id: uid(), text: 'Retaliate', effects: { happiness: -5, karma: -10, reputation: -3 }, chronicleText: 'You retaliated. Both in trouble.', valence: 'negative', npcInteraction: { npcId: sibling.id, type: 'retaliated', severity: 7, domain: 'family' } },
      ],
    });
  }

  return events;
}

function generateAdolescenceEvents(state: GameState): GameEvent[] {
  const friend = state.npcs.find(n => n.relationship === 'friend');
  const events: GameEvent[] = [];

  events.push({
    id: uid(), title: 'Identity Crisis',
    description: 'Popular kids invite you to skip class. It feels like a test of who you are.',
    minAge: 13, maxAge: 17, stage: ['adolescence'],
    choices: [
      { id: uid(), text: 'Join them', effects: { happiness: 5, reputation: 5, karma: -5, health: -3, academicIntelligence: -5 }, chronicleText: 'You skipped class. It felt thrilling but hollow.', valence: 'neutral' },
      { id: uid(), text: 'Decline and go to class', effects: { reputation: -3, karma: 5, academicIntelligence: 3 }, chronicleText: 'You chose your own path.', valence: 'positive' },
    ],
  });

  if (friend) {
    events.push({
      id: uid(), title: "A Friend's Secret",
      description: `${friend.name} confides something serious. They make you promise not to tell.`,
      minAge: 14, maxAge: 17, stage: ['adolescence'],
      choices: [
        { id: uid(), text: 'Keep the secret', effects: { happiness: -5, karma: 8 }, chronicleText: `You kept ${friend.name}'s secret.`, valence: 'positive', npcInteraction: { npcId: friend.id, type: 'kept_secret', severity: 9, domain: 'social' } },
        { id: uid(), text: 'Tell a trusted adult', effects: { karma: 5, reputation: -5 }, chronicleText: `You broke ${friend.name}'s trust to help them.`, valence: 'neutral', npcInteraction: { npcId: friend.id, type: 'broke_trust_for_help', severity: 8, domain: 'social' } },
        { id: uid(), text: 'Distance yourself', effects: { karma: -10, happiness: 3 }, chronicleText: `You pulled away when ${friend.name} needed you.`, valence: 'negative', npcInteraction: { npcId: friend.id, type: 'abandoned', severity: 9, domain: 'social' } },
      ],
    });
  }

  return events;
}

function generateYoungAdultEvents(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];
  const newRomance: NPC = { id: uid(), name: randomName(), birthYear: state.birthYear + Math.floor(Math.random() * 4) - 2, relationship: 'romantic', interactions: [], alive: true, metAtAge: state.currentAge };
  const romanceEvent: GameEvent = {
    id: uid(), title: 'First Love',
    description: `You meet ${newRomance.name}. There's a connection.`,
    minAge: 18, maxAge: 25, stage: ['young_adult'],
    choices: [
      { id: uid(), text: 'Give them your number', effects: { happiness: 12, karma: 2 }, chronicleText: `You gave ${newRomance.name} your number.`, valence: 'positive', npcInteraction: { npcId: newRomance.id, type: 'romantic_interest', severity: 6, domain: 'romantic' } },
      { id: uid(), text: 'Politely decline', effects: { karma: 1 }, chronicleText: `You turned down ${newRomance.name}.`, valence: 'neutral', npcInteraction: { npcId: newRomance.id, type: 'rejected', severity: 4, domain: 'romantic' } },
    ],
  };
  (romanceEvent as any)._newNPC = newRomance;
  events.push(romanceEvent);
  return events;
}

function generateAdultEvents(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];
  const newColleague: NPC = { id: uid(), name: randomName(), birthYear: state.birthYear + Math.floor(Math.random() * 10) - 5, relationship: 'colleague', interactions: [], alive: true, metAtAge: state.currentAge };
  const officeEvent: GameEvent = {
    id: uid(), title: 'Office Politics',
    description: `Your colleague ${newColleague.name} takes credit for your work in a meeting.`,
    minAge: 26, maxAge: 45, stage: ['adult'],
    choices: [
      { id: uid(), text: 'Confront them privately', effects: { reputation: 5, happiness: -3, karma: 5 }, chronicleText: `You confronted ${newColleague.name}.`, valence: 'neutral', npcInteraction: { npcId: newColleague.id, type: 'confronted', severity: 6, domain: 'professional' } },
      { id: uid(), text: 'Let it go', effects: { karma: 8, reputation: -3 }, chronicleText: 'You chose the high road.', valence: 'neutral' },
      { id: uid(), text: 'Report with evidence', effects: { reputation: 8, karma: 2, happiness: -5 }, chronicleText: `${newColleague.name} was reprimanded.`, valence: 'positive', npcInteraction: { npcId: newColleague.id, type: 'reported', severity: 8, domain: 'professional' } },
    ],
  };
  (officeEvent as any)._newNPC = newColleague;
  events.push(officeEvent);
  events.push({
    id: uid(), title: 'Health Scare',
    description: 'A routine checkup reveals something concerning.',
    minAge: 35, maxAge: 50, stage: ['adult', 'mid_life'],
    choices: [
      { id: uid(), text: 'Get tests done immediately', effects: { health: 10, money: -10, happiness: -5 }, chronicleText: 'The tests came back clear. A wake-up call.', valence: 'positive' },
      { id: uid(), text: 'Put it off', effects: { health: -15, karma: -3 }, chronicleText: "You ignored the doctor's advice.", valence: 'negative' },
    ],
  });
  return events;
}

function generateMidLifeEvents(state: GameState): GameEvent[] {
  return [{
    id: uid(), title: 'Legacy Question',
    description: 'You look at your life so far. What will you be remembered for?',
    minAge: 46, maxAge: 60, stage: ['mid_life'],
    choices: [
      { id: uid(), text: 'Volunteer and give back', effects: { happiness: 10, reputation: 12, karma: 15, money: -5 }, chronicleText: 'You began volunteering. The gratitude of strangers filled something money never could.', valence: 'positive' },
      { id: uid(), text: 'Focus on wealth', effects: { money: 15, happiness: -3, karma: -2 }, chronicleText: 'The numbers grew but so did the emptiness.', valence: 'neutral' },
      { id: uid(), text: 'Reconnect with old friends', effects: { happiness: 12, karma: 8 }, chronicleText: 'You reached out to people from your past.', valence: 'positive' },
    ],
  }];
}

function generateElderEvents(): GameEvent[] {
  return [{
    id: uid(), title: 'Retirement',
    description: 'The day has finally come. Your working years are behind you.',
    minAge: 61, maxAge: 70, stage: ['elder'],
    choices: [
      { id: uid(), text: "Embrace it — you've earned this rest", effects: { happiness: 15, health: 5 }, chronicleText: 'You retired with grace.', valence: 'positive' },
      { id: uid(), text: 'Struggle with the loss of purpose', effects: { happiness: -10, health: -5 }, chronicleText: 'Retirement hit harder than expected.', valence: 'negative' },
    ],
  }];
}

function generateLateLifeEvents(): GameEvent[] {
  return [{
    id: uid(), title: 'Looking Back',
    description: 'You sit quietly, memories flooding in.',
    minAge: 81, maxAge: 100, stage: ['late_life'],
    choices: [
      { id: uid(), text: 'Smile — no regrets', effects: { happiness: 10, karma: 5 }, chronicleText: 'You looked back with peace.', valence: 'positive' },
      { id: uid(), text: 'Wonder what could have been', effects: { happiness: -5, karma: -2 }, chronicleText: 'Regret crept in during the quiet hours.', valence: 'negative' },
    ],
  }];
}

function getEventsForAge(state: GameState): { events: GameEvent[]; newNPCs: Map<string, NPC> } {
  const stage = getLifeStage(state.currentAge);
  let events: GameEvent[] = [];
  const allNewNPCs = new Map<string, NPC>();

  const addEvents = (result: { events: GameEvent[]; newNPCs: Map<string, NPC> }) => {
    events = [...events, ...result.events];
    result.newNPCs.forEach((npc, id) => allNewNPCs.set(id, npc));
  };

  switch (stage) {
    case 'childhood':
      events = generateChildhoodEvents(state);
      addEvents(generateSchoolLifeEvents(state));
      break;
    case 'adolescence':
      events = [...generateAdolescenceEvents(state)];
      addEvents(generateDeepAdolescenceEvents(state));
      addEvents(generateSchoolLifeEvents(state));
      if (!state.careerPathChosen) {
        const crimEvent = getCriminalPathEvent(state);
        if (crimEvent) events.push(crimEvent);
      }
      break;
    case 'young_adult':
      events = generateYoungAdultEvents(state);
      addEvents(generateDeepAdolescenceEvents(state));
      if (!state.careerPathChosen) {
        const fork = getCareerForkEvent(state);
        if (fork) events.push(fork);
        const pol = getPoliticalPathEvent(state);
        if (pol) events.push(pol);
      }
      if (state.criminalPath) addEvents(generateCriminalEvents(state));
      else if (state.politicalPath) addEvents(generatePoliticalEvents(state));
      else if (state.careerPathChosen) addEvents(generateCareerEvents(state));
      break;
    case 'adult':
      events = generateAdultEvents(state);
      if (state.criminalPath) addEvents(generateCriminalEvents(state));
      else if (state.politicalPath) addEvents(generatePoliticalEvents(state));
      else if (state.careerPathChosen) addEvents(generateCareerEvents(state));
      break;
    case 'mid_life':
      events = generateMidLifeEvents(state);
      if (state.politicalPath) addEvents(generatePoliticalEvents(state));
      break;
    case 'elder': events = generateElderEvents(); break;
    case 'late_life': events = generateLateLifeEvents(); break;
  }

  return {
    events: events.filter(e => state.currentAge >= e.minAge && state.currentAge <= e.maxAge),
    newNPCs: allNewNPCs,
  };
}

function checkDeath(state: GameState): boolean {
  if (state.currentAge < 50) return false;
  const base = (state.currentAge - 50) * 0.02;
  const healthMod = (100 - state.stats.health) * 0.005;
  const heatMod = state.criminalPath ? state.policeHeat * 0.001 : 0;
  return Math.random() < (base + healthMod + heatMod);
}

export function selectEventForAge(state: GameState): GameState {
  const examEvent = getMandatoryExamEvent(state);
  if (examEvent) {
    return { ...state, currentEvent: { event: examEvent, involvedNPCs: [] } };
  }

  const { events, newNPCs } = getEventsForAge(state);
  if (events.length === 0) return state;

  const mandatory = events.filter(e => e.isMandatory);
  const pool = mandatory.length > 0 ? mandatory : events;
  const event = pool[Math.floor(Math.random() * pool.length)];

  let npcs = [...state.npcs];
  const legacyNPC = (event as any)._newNPC as NPC | undefined;
  if (legacyNPC && !npcs.find(n => n.id === legacyNPC.id)) npcs = [...npcs, legacyNPC];

  const involvedIds = event.choices.filter(c => c.npcInteraction).map(c => c.npcInteraction!.npcId);
  for (const id of involvedIds) {
    if (newNPCs.has(id) && !npcs.find(n => n.id === id)) npcs = [...npcs, newNPCs.get(id)!];
  }

  return { ...state, npcs, currentEvent: { event, involvedNPCs: involvedIds } };
}

export function applyChoice(state: GameState, choice: EventChoice): GameState {
  const newStats = { ...state.stats };
  if (choice.effects.health !== undefined) newStats.health = clamp(newStats.health + choice.effects.health, 0, 100);
  if (choice.effects.happiness !== undefined) newStats.happiness = clamp(newStats.happiness + choice.effects.happiness, 0, 100);
  if (choice.effects.money !== undefined) newStats.money = clamp(newStats.money + choice.effects.money, 0, 100);
  if (choice.effects.reputation !== undefined) newStats.reputation = clamp(newStats.reputation + choice.effects.reputation, 0, 100);
  if (choice.effects.karma !== undefined) newStats.karma = clamp(newStats.karma + choice.effects.karma, -100, 100);

  let academicIntelligence = state.academicIntelligence;
  let streetReputation = state.streetReputation;
  let policeHeat = state.policeHeat;
  let approvalRating = state.approvalRating;
  let coalitionStability = state.coalitionStability;
  let annualSalary = state.annualSalary;

  if (choice.effects.academicIntelligence !== undefined) academicIntelligence = clamp(academicIntelligence + choice.effects.academicIntelligence, 0, 100);
  if (choice.effects.streetReputation !== undefined) streetReputation = clamp(streetReputation + choice.effects.streetReputation, 0, 100);
  if (choice.effects.policeHeat !== undefined) policeHeat = clamp(policeHeat + choice.effects.policeHeat, 0, 100);
  if (choice.effects.approvalRating !== undefined) approvalRating = clamp(approvalRating + choice.effects.approvalRating, 0, 100);
  if (choice.effects.coalitionStability !== undefined) coalitionStability = clamp(coalitionStability + choice.effects.coalitionStability, 0, 100);
  if (choice.effects.annualSalary !== undefined) annualSalary = Math.max(0, annualSalary + choice.effects.annualSalary);

  let career = state.career;
  let careerTitle = state.careerTitle;
  let careerPathChosen = state.careerPathChosen;
  let criminalPath = state.criminalPath;
  let politicalPath = state.politicalPath;
  let universityLocked = state.universityLocked;
  let examsTaken = [...state.examsTaken];

  if (choice.setsCareer) { career = choice.setsCareer; careerTitle = choice.setsCareer; careerPathChosen = true; }
  if (choice.setsCriminalPath) { criminalPath = true; careerPathChosen = true; careerTitle = 'Street'; }
  if (choice.setsPoliticalPath) { politicalPath = true; careerPathChosen = true; careerTitle = 'Politician'; }
  if (choice.locksUniversity) universityLocked = true;

  const config = getActiveCountry(state);
  const examAges = config.exams.map(e => e.age);
  if (examAges.includes(state.currentAge) && !examsTaken.includes(state.currentAge)) {
    examsTaken.push(state.currentAge);
  }

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

  return {
    ...state,
    stats: newStats, npcs,
    chronicle: [...state.chronicle, { age: state.currentAge, text: choice.chronicleText, valence: choice.valence }],
    currentEvent: null,
    career, careerTitle, careerPathChosen, criminalPath, politicalPath, universityLocked, examsTaken,
    academicIntelligence, streetReputation, policeHeat, approvalRating, coalitionStability, annualSalary,
  };
}

export function advanceYear(state: GameState): GameState {
  if (state.currentEvent) return state;

  const newAge = state.currentAge + 1;
  let newState = { ...state, currentAge: newAge };

  // Passive salary income
  if (newState.annualSalary > 0) {
    newState.stats = { ...newState.stats, money: clamp(newState.stats.money + Math.floor(newState.annualSalary / 10), 0, 100) };
  }

  // Health drift after 50
  if (newAge > 50) {
    newState.stats = { ...newState.stats, health: clamp(newState.stats.health - Math.floor(Math.random() * 3), 0, 100) };
  }

  // Police heat fades
  if (newState.policeHeat > 0) {
    newState = { ...newState, policeHeat: Math.max(0, newState.policeHeat - 2) };
  }

  if (checkDeath(newState)) {
    const karma = newState.stats.karma;
    const epitaph = karma > 30 ? 'They left the world better than they found it.' : karma < -30 ? 'Their legacy was complicated.' : 'They lived a full life, with all its contradictions.';
    return {
      ...newState,
      phase: 'dead',
      chronicle: [...newState.chronicle, { age: newAge, text: `${state.playerName} passed away at age ${newAge}. ${epitaph}`, valence: 'neutral' }],
    };
  }

  const reappearanceEvent = checkReappearance(newState);
  if (reappearanceEvent) {
    return { ...newState, currentEvent: { event: reappearanceEvent, involvedNPCs: reappearanceEvent.choices.filter(c => c.npcInteraction).map(c => c.npcInteraction!.npcId) } };
  }

  newState = selectEventForAge(newState);

  if (!newState.currentEvent) {
    const quietEntries = ['A quiet year passes.', 'Life continues at its own pace.', 'The seasons change, and so do you.', 'Another year in the books.'];
    newState.chronicle = [...newState.chronicle, { age: newAge, text: quietEntries[Math.floor(Math.random() * quietEntries.length)], valence: 'neutral' as const }];
  }

  return newState;
}
