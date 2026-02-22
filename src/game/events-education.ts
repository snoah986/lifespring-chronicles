import { GameState, GameEvent, NPC, EventChoice } from './types';

let eduId = 20000;
function eid(): string {
  return `edu_${eduId++}`;
}

function randomName(): string {
  const first = ['Marcus', 'Priya', 'Elena', 'Tobias', 'Amara', 'Felix', 'Sione', 'Hana'];
  const last = ['Webb', 'Sharma', 'Novak', 'Brandt', 'Diallo', 'Russo', 'Faleolo', 'Inoue'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

/**
 * Mandatory exam events at ages 11, 16, and 18.
 * Returns null if this exam has already been taken.
 */
export function getMandatoryExamEvent(state: GameState): GameEvent | null {
  const examAges = [11, 16, 18];
  const age = state.currentAge;

  if (!examAges.includes(age)) return null;
  if (state.examsTaken.includes(age)) return null;

  if (age === 11) return buildAge11Exam(state);
  if (age === 16) return buildAge16Exam(state);
  if (age === 18) return buildAge18Exam(state);
  return null;
}

function buildAge11Exam(state: GameState): GameEvent {
  const teacher = state.npcs.find(n => n.relationship === 'teacher');
  const teacherRef = teacher ? `Your teacher ${teacher.name} watches the room carefully.` : 'Your teacher watches the room carefully.';

  return {
    id: eid(),
    title: 'Primary School Exams',
    description: `It's the biggest test of your young life so far. ${teacherRef} The results will decide which secondary school you can attend.`,
    minAge: 11, maxAge: 11,
    stage: ['childhood'],
    isMandatory: true,
    choices: [
      {
        id: eid(),
        text: 'I studied hard — give it everything',
        effects: { academicIntelligence: 15, happiness: 5, reputation: 8 },
        chronicleText: 'You sat your primary exams prepared and focused. The results opened doors.',
        valence: 'positive',
        ...(teacher ? { npcInteraction: { npcId: teacher.id, type: 'impressed_teacher', severity: 5, domain: 'academic' } } : {}),
      },
      {
        id: eid(),
        text: 'Wing it — it\'s just school',
        effects: { academicIntelligence: -10, happiness: 3 },
        chronicleText: 'You barely prepared for the exams. The results were disappointing.',
        valence: 'negative',
      },
      {
        id: eid(),
        text: 'Try your best but panic halfway through',
        effects: { academicIntelligence: 5, happiness: -5 },
        chronicleText: 'Nerves got the better of you halfway through. A mixed result.',
        valence: 'neutral',
      },
    ],
  };
}

function buildAge16Exam(state: GameState): GameEvent {
  const classmate = state.npcs.find(n => n.relationship === 'classmate');
  const classmateLine = classmate
    ? `${classmate.name} is in the same exam hall. You catch their eye — they look as anxious as you feel.`
    : 'The exam hall is silent except for the scratch of pens.';

  return {
    id: eid(),
    title: 'Secondary School Exams (Age 16)',
    description: `The exams that determine your future are here. ${classmateLine} University, college, or work — it all hinges on the next few weeks.`,
    minAge: 16, maxAge: 16,
    stage: ['adolescence'],
    isMandatory: true,
    choices: [
      {
        id: eid(),
        text: 'Revise obsessively — sacrifice everything for grades',
        effects: { academicIntelligence: 18, happiness: -8, health: -5, reputation: 5 },
        chronicleText: 'You sacrificed your social life for revision. The grades were worth it.',
        valence: 'positive',
        ...(classmate ? { npcInteraction: { npcId: classmate.id, type: 'studied_apart', severity: 4, domain: 'academic' } } : {}),
      },
      {
        id: eid(),
        text: 'Balance study with life — steady approach',
        effects: { academicIntelligence: 10, happiness: 3 },
        chronicleText: 'You kept a sensible balance. Solid results, no regrets.',
        valence: 'positive',
      },
      {
        id: eid(),
        text: 'Barely show up — there are better things in life',
        effects: { academicIntelligence: -15, happiness: 8, reputation: -8 },
        chronicleText: 'You skipped revision and barely scraped through. Some doors quietly closed.',
        valence: 'negative',
        locksUniversity: false, // Not yet locked — one more chance at 18
      },
    ],
  };
}

function buildAge18Exam(state: GameState): GameEvent {
  const isAlreadyBehind = state.academicIntelligence < 40;
  const description = isAlreadyBehind
    ? `Your final exams arrive. Your academic record has been shaky, and you know it. This is your last chance to unlock a university path. The pressure is immense.`
    : `Your final school exams. Years of work come down to this. University placements are watching these results.`;

  return {
    id: eid(),
    title: 'Final Exams (Age 18)',
    description,
    minAge: 18, maxAge: 18,
    stage: ['young_adult'],
    isMandatory: true,
    choices: [
      {
        id: eid(),
        text: 'Push through — go all in for university',
        effects: { academicIntelligence: 20, happiness: -5, health: -5 },
        chronicleText: 'You pushed yourself to the limit. The results confirmed your university place.',
        valence: 'positive',
      },
      {
        id: eid(),
        text: 'Do what you can — you\'re not built for academia',
        effects: { academicIntelligence: 5 },
        chronicleText: 'You sat the exams without great ambition. University was not in the cards.',
        valence: 'neutral',
        locksUniversity: true,
      },
      {
        id: eid(),
        text: 'Walk out — you\'ve already decided to skip university',
        effects: { happiness: 5, academicIntelligence: -5 },
        chronicleText: 'You chose a different path. The academic route closed behind you.',
        valence: 'neutral',
        locksUniversity: true,
      },
    ],
  };
}

/**
 * School life events for ages 10-16 that introduce NPCs into the memory log.
 */
export function generateSchoolLifeEvents(state: GameState): { events: GameEvent[]; newNPCs: Map<string, NPC> } {
  const events: GameEvent[] = [];
  const newNPCs = new Map<string, NPC>();

  // Event: The Bully
  const bullyNPC: NPC = {
    id: eid(),
    name: randomName(),
    birthYear: state.birthYear + 1,
    relationship: 'rival',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(bullyNPC.id, bullyNPC);

  events.push({
    id: eid(),
    title: 'The Bully',
    description: `${bullyNPC.name} has been making your life difficult. Today they corner you in the corridor and demand your lunch money in front of everyone.`,
    minAge: 10, maxAge: 14,
    stage: ['childhood', 'adolescence'],
    choices: [
      {
        id: eid(),
        text: 'Refuse and stand your ground, even knowing it will escalate',
        effects: { health: -8, reputation: 10, happiness: 5, karma: 5 },
        chronicleText: `You refused to give ${bullyNPC.name} anything. They hit you, but something shifted. People noticed.`,
        valence: 'positive',
        npcInteraction: { npcId: bullyNPC.id, type: 'defied_bully', severity: 8, domain: 'social' },
      },
      {
        id: eid(),
        text: 'Hand it over and walk away',
        effects: { happiness: -8, reputation: -5, karma: -3 },
        chronicleText: `You gave ${bullyNPC.name} what they wanted. The humiliation lingered.`,
        valence: 'negative',
        npcInteraction: { npcId: bullyNPC.id, type: 'submitted_to_bully', severity: 7, domain: 'social' },
      },
      {
        id: eid(),
        text: 'Report it to a teacher',
        effects: { reputation: -3, happiness: 3, karma: 3 },
        chronicleText: `You reported ${bullyNPC.name}. They were warned. They never forgave you for it.`,
        valence: 'neutral',
        npcInteraction: { npcId: bullyNPC.id, type: 'reported_to_authority', severity: 8, domain: 'social' },
      },
    ],
  });

  // Event: Study Group — introduces a mentor NPC
  const studyMentorNPC: NPC = {
    id: eid(),
    name: randomName(),
    birthYear: state.birthYear - 15,
    relationship: 'mentor',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(studyMentorNPC.id, studyMentorNPC);

  events.push({
    id: eid(),
    title: 'The Mentor\'s Study Group',
    description: `${studyMentorNPC.name}, an older student, is running a free Saturday study group. It clashes with hanging out with friends. You could learn a lot — or you could just enjoy your weekend.`,
    minAge: 12, maxAge: 16,
    stage: ['adolescence'],
    choices: [
      {
        id: eid(),
        text: 'Join the study group every week',
        effects: { academicIntelligence: 12, happiness: -3, reputation: 5 },
        chronicleText: `${studyMentorNPC.name} became a formative influence. The things they taught you went beyond exams.`,
        valence: 'positive',
        npcInteraction: { npcId: studyMentorNPC.id, type: 'mentored', severity: 7, domain: 'academic' },
      },
      {
        id: eid(),
        text: 'Go once but then stop going',
        effects: { academicIntelligence: 3 },
        chronicleText: `You attended once. ${studyMentorNPC.name} noticed you never came back.`,
        valence: 'neutral',
        npcInteraction: { npcId: studyMentorNPC.id, type: 'dropped_out', severity: 4, domain: 'academic' },
      },
      {
        id: eid(),
        text: 'Skip it — school isn\'t everything',
        effects: { happiness: 8, academicIntelligence: -5 },
        chronicleText: 'You chose your social life. The weekend was great. The exams were not.',
        valence: 'neutral',
      },
    ],
  });

  // Event: Classroom Rivalry
  const classrivalNPC: NPC = {
    id: eid(),
    name: randomName(),
    birthYear: state.birthYear,
    relationship: 'classmate',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(classrivalNPC.id, classrivalNPC);

  events.push({
    id: eid(),
    title: 'Classroom Rivalry',
    description: `${classrivalNPC.name} is always one step ahead of you academically. When you both get the top two scores on a test, the teacher asks you each to read your essays aloud. ${classrivalNPC.name} goes first and their work is genuinely brilliant.`,
    minAge: 13, maxAge: 17,
    stage: ['adolescence'],
    choices: [
      {
        id: eid(),
        text: 'Read yours proudly — competition makes you better',
        effects: { academicIntelligence: 8, reputation: 5, happiness: 3 },
        chronicleText: `You read your essay with confidence. ${classrivalNPC.name} nodded in respect. A rivalry forged.`,
        valence: 'positive',
        npcInteraction: { npcId: classrivalNPC.id, type: 'academic_rivalry', severity: 6, domain: 'academic' },
      },
      {
        id: eid(),
        text: 'Undermine them with a comment before you read',
        effects: { reputation: -5, karma: -8, academicIntelligence: 3 },
        chronicleText: `You made a cutting remark. The room went cold. ${classrivalNPC.name} never forgot.`,
        valence: 'negative',
        npcInteraction: { npcId: classrivalNPC.id, type: 'publicly_undermined', severity: 9, domain: 'academic' },
      },
      {
        id: eid(),
        text: 'Compliment their work sincerely',
        effects: { karma: 8, reputation: 5, happiness: 3 },
        chronicleText: `You praised ${classrivalNPC.name} genuinely. It surprised them. It surprised you too.`,
        valence: 'positive',
        npcInteraction: { npcId: classrivalNPC.id, type: 'praised_rival', severity: 7, domain: 'academic' },
      },
    ],
  });

  return {
    events: events.filter(e => state.currentAge >= e.minAge && state.currentAge <= e.maxAge),
    newNPCs,
  };
}
