import { GameState, GameEvent, NPC } from './types';

let carId = 30000;
function cid(): string {
  return `car_${carId++}`;
}

function randomName(): string {
  const first = ['Leon', 'Yuki', 'Anya', 'Marcus', 'Cleo', 'Damon', 'Ingrid', 'Rafael'];
  const last = ['Ashby', 'Tanaka', 'Volkov', 'Webb', 'Ferreira', 'Hayes', 'Strand', 'Obi'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

/**
 * The Career Fork event. Fires once at age 18 (or 22 if university path).
 * Only fires if careerPathChosen is false.
 */
export function getCareerForkEvent(state: GameState): GameEvent | null {
  if (state.careerPathChosen) return null;

  const isPostUniversity = state.currentAge === 22 && !state.universityLocked;
  const isWorkingAge = state.currentAge === 18 && state.universityLocked;

  if (!isPostUniversity && !isWorkingAge) return null;

  const intro = isPostUniversity
    ? 'You graduate from university. The world is open. But the first step is always the hardest.'
    : 'University was never going to be your path. Now it\'s time to decide what will be.';

  return {
    id: cid(),
    title: 'Career Crossroads',
    description: `${intro} Which direction do you take?`,
    minAge: state.currentAge, maxAge: state.currentAge,
    stage: ['young_adult'],
    isMandatory: true,
    choices: [
      {
        id: cid(),
        text: isPostUniversity ? 'Enter the corporate world — use that degree' : 'Take an office job — steady and reliable',
        effects: { annualSalary: 28, reputation: 5 },
        chronicleText: 'You entered the corporate workforce. The commute was grim, but the salary was real.',
        valence: 'neutral',
        setsCareer: 'Corporate',
      },
      {
        id: cid(),
        text: 'Go into skilled trades — honest work, good money',
        effects: { annualSalary: 24, health: 5, happiness: 5 },
        chronicleText: 'You chose a trade. The work was physical but honest, and you were good at it.',
        valence: 'positive',
        setsCareer: 'Trades',
      },
      {
        id: cid(),
        text: 'Retail and service — flexible, immediate',
        effects: { annualSalary: 18, happiness: -3 },
        chronicleText: 'You took a retail position. Not glamorous, but it paid rent while you figured things out.',
        valence: 'neutral',
        setsCareer: 'Retail',
      },
      {
        id: cid(),
        text: isPostUniversity
          ? 'Ignore the corporate ladder — start your own thing'
          : 'Freelance and hustle — build something yourself',
        effects: { annualSalary: 10, happiness: 10, money: -5, reputation: 3 },
        chronicleText: 'You went independent. Income was unpredictable, but the freedom was worth it.',
        valence: 'positive',
        setsCareer: 'Freelance',
      },
    ],
  };
}

/**
 * Career-specific workplace events.
 * Returns events appropriate to the player's current career.
 */
export function generateCareerEvents(state: GameState): { events: GameEvent[]; newNPCs: Map<string, NPC> } {
  const events: GameEvent[] = [];
  const newNPCs = new Map<string, NPC>();

  if (state.career === 'Corporate' || state.career === 'Freelance') {
    const { events: e, newNPCs: n } = getCorporateEvents(state);
    e.forEach(ev => events.push(ev));
    n.forEach((npc, id) => newNPCs.set(id, npc));
  }

  if (state.career === 'Trades') {
    const { events: e, newNPCs: n } = getTradesEvents(state);
    e.forEach(ev => events.push(ev));
    n.forEach((npc, id) => newNPCs.set(id, npc));
  }

  if (state.career === 'Retail') {
    const { events: e, newNPCs: n } = getRetailEvents(state);
    e.forEach(ev => events.push(ev));
    n.forEach((npc, id) => newNPCs.set(id, npc));
  }

  return {
    events: events.filter(e => state.currentAge >= e.minAge && state.currentAge <= e.maxAge),
    newNPCs,
  };
}

function getCorporateEvents(state: GameState): { events: GameEvent[]; newNPCs: Map<string, NPC> } {
  const newNPCs = new Map<string, NPC>();
  const events: GameEvent[] = [];

  // Rival colleague
  const rivalColleague: NPC = {
    id: cid(),
    name: randomName(),
    birthYear: state.birthYear + Math.floor(Math.random() * 4) - 2,
    relationship: 'colleague',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(rivalColleague.id, rivalColleague);

  events.push({
    id: cid(),
    title: 'The Promotion',
    description: `You and ${rivalColleague.name} are both up for the same promotion. You discover they've been subtly undermining your work in meetings. Your manager asks you both to present to the board next week.`,
    minAge: 22, maxAge: 35,
    stage: ['young_adult', 'adult'],
    choices: [
      {
        id: cid(),
        text: 'Deliver the best presentation of your life and let the work speak',
        effects: { reputation: 12, happiness: 5, annualSalary: 6 },
        chronicleText: `Your presentation was exceptional. You got the promotion. ${rivalColleague.name} never forgot it.`,
        valence: 'positive',
        npcInteraction: { npcId: rivalColleague.id, type: 'outcompeted', severity: 7, domain: 'professional' },
      },
      {
        id: cid(),
        text: 'Expose their undermining to management before the presentation',
        effects: { reputation: 5, karma: -5, happiness: -3 },
        chronicleText: `You went to management with what you knew. ${rivalColleague.name} was disciplined. You were seen as political.`,
        valence: 'neutral',
        npcInteraction: { npcId: rivalColleague.id, type: 'reported_sabotage', severity: 9, domain: 'professional' },
      },
      {
        id: cid(),
        text: 'Sabotage their presentation in return',
        effects: { karma: -12, money: 5 },
        chronicleText: `You played dirty. The promotion was yours, but ${rivalColleague.name} knew exactly what you did.`,
        valence: 'negative',
        npcInteraction: { npcId: rivalColleague.id, type: 'sabotaged', severity: 10, domain: 'professional' },
      },
    ],
  });

  // Redundancy threat
  events.push({
    id: cid(),
    title: 'Redundancy Round',
    description: 'The company announces layoffs. Your department is being restructured. You\'re not on the list — but a junior colleague you like is.',
    minAge: 28, maxAge: 45,
    stage: ['adult'],
    choices: [
      {
        id: cid(),
        text: 'Advocate strongly for them to be kept on',
        effects: { reputation: 8, karma: 10, happiness: 3 },
        chronicleText: 'You went to bat for your colleague. They kept their job. They never forgot it.',
        valence: 'positive',
      },
      {
        id: cid(),
        text: 'Stay quiet — you can\'t risk your own position',
        effects: { happiness: -5, karma: -5 },
        chronicleText: 'You said nothing. Your colleague was let go. The guilt stayed with you.',
        valence: 'negative',
      },
    ],
  });

  return { events, newNPCs };
}

function getTradesEvents(state: GameState): { events: GameEvent[]; newNPCs: Map<string, NPC> } {
  const newNPCs = new Map<string, NPC>();
  const events: GameEvent[] = [];

  const apprentice: NPC = {
    id: cid(),
    name: randomName(),
    birthYear: state.birthYear + 8,
    relationship: 'colleague',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(apprentice.id, apprentice);

  events.push({
    id: cid(),
    title: 'The Apprentice',
    description: `${apprentice.name} is your new apprentice. They're inexperienced but eager. A big job comes in that requires more skill than they have. You can do it yourself or let them try.`,
    minAge: 25, maxAge: 40,
    stage: ['adult'],
    choices: [
      {
        id: cid(),
        text: 'Guide them through it patiently',
        effects: { happiness: 5, karma: 8, reputation: 5 },
        chronicleText: `You spent twice as long on the job mentoring ${apprentice.name}. They got it right.`,
        valence: 'positive',
        npcInteraction: { npcId: apprentice.id, type: 'mentored_apprentice', severity: 7, domain: 'professional' },
      },
      {
        id: cid(),
        text: 'Take over and do it yourself — no time for mistakes',
        effects: { reputation: 3, happiness: -3, annualSalary: 2 },
        chronicleText: `You pushed ${apprentice.name} aside to finish the job. Efficient, but they felt it.`,
        valence: 'neutral',
        npcInteraction: { npcId: apprentice.id, type: 'sidelined', severity: 6, domain: 'professional' },
      },
    ],
  });

  return { events, newNPCs };
}

function getRetailEvents(state: GameState): { events: GameEvent[]; newNPCs: Map<string, NPC> } {
  const newNPCs = new Map<string, NPC>();
  const events: GameEvent[] = [];

  const manager: NPC = {
    id: cid(),
    name: randomName(),
    birthYear: state.birthYear - 10,
    relationship: 'colleague',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(manager.id, manager);

  events.push({
    id: cid(),
    title: 'The Manager\'s Offer',
    description: `${manager.name}, your supervisor, offers you a shift manager role. It means more responsibility, slightly better pay — but also covering for their frequent absences and taking the blame when things go wrong.`,
    minAge: 19, maxAge: 30,
    stage: ['young_adult', 'adult'],
    choices: [
      {
        id: cid(),
        text: 'Accept — it\'s a step up',
        effects: { annualSalary: 4, reputation: 5, happiness: -3, karma: 2 },
        chronicleText: `You took the shift manager role. ${manager.name} leaned on you heavily. You learned what it meant to hold things together.`,
        valence: 'neutral',
        npcInteraction: { npcId: manager.id, type: 'accepted_role', severity: 5, domain: 'professional' },
      },
      {
        id: cid(),
        text: 'Decline — you know a trap when you see one',
        effects: { happiness: 5, karma: 3 },
        chronicleText: `You turned the offer down. ${manager.name} seemed surprised. You kept your boundaries.`,
        valence: 'positive',
        npcInteraction: { npcId: manager.id, type: 'declined_role', severity: 4, domain: 'professional' },
      },
      {
        id: cid(),
        text: 'Accept but set clear limits upfront',
        effects: { annualSalary: 4, reputation: 8, happiness: 3 },
        chronicleText: `You negotiated your terms. ${manager.name} respected you for it. A rare moment of mutual understanding.`,
        valence: 'positive',
        npcInteraction: { npcId: manager.id, type: 'negotiated_terms', severity: 7, domain: 'professional' },
      },
    ],
  });

  return { events, newNPCs };
}
