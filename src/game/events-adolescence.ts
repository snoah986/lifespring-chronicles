import { GameState, GameEvent, NPC } from './types';

let evtId = 5000;
function eid(): string {
  return `adol_${evtId++}`;
}

function randomName(): string {
  const first = ['Zara', 'Luca', 'Mira', 'Theo', 'Nadia', 'Oscar', 'Iris', 'Jude'];
  const last = ['Vance', 'Osei', 'Lin', 'Brennan', 'Sato', 'Morales', 'Holt'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

/**
 * 10 high-fidelity events for ages 12–25 that create high-severity
 * NPC interactions designed to trigger the Reappearance Engine later.
 */
export function generateDeepAdolescenceEvents(state: GameState): { events: GameEvent[]; newNPCs: Map<string, NPC> } {
  const friend = state.npcs.find(n => n.relationship === 'friend');
  const sibling = state.npcs.find(n => n.relationship === 'family');
  const classmate = state.npcs.find(n => n.relationship === 'classmate');

  const events: GameEvent[] = [];
  const newNPCs = new Map<string, NPC>();

  // --- Event 1: The Cheating Scandal (age 13-16) ---
  if (classmate) {
    events.push({
      id: eid(),
      title: 'The Cheating Scandal',
      description: `During a major exam, you catch ${classmate.name} copying from your paper. They plead with their eyes for you to stay quiet. The teacher is watching.`,
      minAge: 13, maxAge: 16,
      stage: ['adolescence'],
      choices: [
        {
          id: eid(),
          text: 'Shield your paper but say nothing',
          effects: { karma: 3, reputation: -2 },
          chronicleText: `You silently moved your paper away from ${classmate.name}. They failed the test and blamed you.`,
          valence: 'negative',
          npcInteraction: { npcId: classmate.id, type: 'silent_rejection', severity: 7, domain: 'academic' },
        },
        {
          id: eid(),
          text: 'Let them copy — loyalty matters more',
          effects: { karma: -5, reputation: -5, happiness: 3 },
          chronicleText: `You let ${classmate.name} copy your answers. You both passed, but the guilt was yours alone.`,
          valence: 'neutral',
          npcInteraction: { npcId: classmate.id, type: 'enabled_cheating', severity: 8, domain: 'academic' },
        },
        {
          id: eid(),
          text: 'Raise your hand and report it',
          effects: { karma: 8, reputation: 10, happiness: -8 },
          chronicleText: `You reported ${classmate.name} for cheating. They were suspended. Half the class called you a snitch.`,
          valence: 'negative',
          npcInteraction: { npcId: classmate.id, type: 'reported_cheating', severity: 9, domain: 'academic' },
        },
      ],
    });
  }

  // --- Event 2: The Forbidden Friendship (age 14-17) ---
  const rivalNPC: NPC = {
    id: eid(),
    name: randomName(),
    birthYear: state.birthYear + 1,
    relationship: 'rival',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(rivalNPC.id, rivalNPC);

  events.push({
    id: eid(),
    title: 'The Forbidden Friendship',
    description: `A new student, ${rivalNPC.name}, arrives at school. They're talented but abrasive. They challenge you publicly in front of others, but later approach you privately with respect.`,
    minAge: 14, maxAge: 17,
    stage: ['adolescence'],
    choices: [
      {
        id: eid(),
        text: 'Accept their private respect — form an uneasy alliance',
        effects: { reputation: 3, happiness: 3, karma: 2 },
        chronicleText: `You and ${rivalNPC.name} formed a wary but genuine connection beneath the surface rivalry.`,
        valence: 'positive',
        npcInteraction: { npcId: rivalNPC.id, type: 'allied', severity: 7, domain: 'social' },
      },
      {
        id: eid(),
        text: 'Reject them — they humiliated you publicly',
        effects: { reputation: 5, karma: -3, happiness: -2 },
        chronicleText: `You shut ${rivalNPC.name} out. Pride won, but you wondered if you lost something.`,
        valence: 'negative',
        npcInteraction: { npcId: rivalNPC.id, type: 'rejected', severity: 8, domain: 'social' },
      },
    ],
  });

  // --- Event 3: The Betrayal (age 15-17) ---
  if (friend) {
    events.push({
      id: eid(),
      title: 'The Betrayal',
      description: `You discover ${friend.name} has been spreading rumors about you behind your back. They don't know you've found out.`,
      minAge: 15, maxAge: 17,
      stage: ['adolescence'],
      choices: [
        {
          id: eid(),
          text: 'Confront them directly',
          effects: { reputation: 5, happiness: -5, karma: 5 },
          chronicleText: `You confronted ${friend.name} about the rumors. The friendship cracked open, raw and ugly.`,
          valence: 'negative',
          npcInteraction: { npcId: friend.id, type: 'confronted_betrayal', severity: 9, domain: 'social' },
        },
        {
          id: eid(),
          text: 'Spread counter-rumors — fight fire with fire',
          effects: { reputation: -5, karma: -12, happiness: 3 },
          chronicleText: `You started your own whisper campaign against ${friend.name}. The social battlefield turned toxic.`,
          valence: 'negative',
          npcInteraction: { npcId: friend.id, type: 'retaliated_rumors', severity: 10, domain: 'social' },
        },
        {
          id: eid(),
          text: 'Say nothing and quietly distance yourself',
          effects: { karma: 3, happiness: -8 },
          chronicleText: `You silently pulled away from ${friend.name}. They never knew you knew. The loss was quiet but deep.`,
          valence: 'neutral',
          npcInteraction: { npcId: friend.id, type: 'silent_withdrawal', severity: 7, domain: 'social' },
        },
      ],
    });
  }

  // --- Event 4: The Talent Show (age 13-16) ---
  events.push({
    id: eid(),
    title: 'The Talent Show',
    description: "The school talent show is coming up. You've been secretly practicing something for months. Performing would mean exposing a vulnerable side of yourself.",
    minAge: 13, maxAge: 16,
    stage: ['adolescence'],
    choices: [
      {
        id: eid(),
        text: 'Perform — own the stage',
        effects: { happiness: 12, reputation: 10, karma: 3 },
        chronicleText: 'You stepped onto the stage and bared your soul. The applause felt like sunrise.',
        valence: 'positive',
      },
      {
        id: eid(),
        text: 'Back out at the last minute',
        effects: { happiness: -10, karma: -2 },
        chronicleText: 'You couldn\'t do it. The regret sat in your chest like a stone for years.',
        valence: 'negative',
      },
    ],
  });

  // --- Event 5: The Mentor (age 16-18) ---
  const mentorNPC: NPC = {
    id: eid(),
    name: randomName(),
    birthYear: state.birthYear - 25,
    relationship: 'mentor',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(mentorNPC.id, mentorNPC);

  events.push({
    id: eid(),
    title: 'The Mentor\'s Offer',
    description: `${mentorNPC.name}, a respected figure in the community, sees potential in you and offers private mentorship. But they demand absolute commitment and have a reputation for being ruthlessly demanding.`,
    minAge: 16, maxAge: 18,
    stage: ['adolescence', 'young_adult'],
    choices: [
      {
        id: eid(),
        text: 'Accept — greatness requires sacrifice',
        effects: { reputation: 8, happiness: -5, karma: 3, money: -3 },
        chronicleText: `You entered ${mentorNPC.name}'s tutelage. The work was brutal, but you were being forged.`,
        valence: 'positive',
        npcInteraction: { npcId: mentorNPC.id, type: 'accepted_mentorship', severity: 8, domain: 'academic' },
      },
      {
        id: eid(),
        text: 'Decline — you want to find your own path',
        effects: { karma: 2, happiness: 3 },
        chronicleText: `You turned down ${mentorNPC.name}. They respected it, but the door closed behind you.`,
        valence: 'neutral',
        npcInteraction: { npcId: mentorNPC.id, type: 'declined_mentorship', severity: 7, domain: 'academic' },
      },
    ],
  });

  // --- Event 6: The Party Incident (age 16-19) ---
  if (sibling) {
    events.push({
      id: eid(),
      title: 'The Party Incident',
      description: `At a party, you find ${sibling.name} in a dangerous situation — they've had too much to drink and are about to leave with strangers. Intervening could cause a massive family fight.`,
      minAge: 16, maxAge: 19,
      stage: ['adolescence', 'young_adult'],
      choices: [
        {
          id: eid(),
          text: 'Drag them out of there, no matter the scene',
          effects: { reputation: -3, karma: 15, happiness: -3, health: -3 },
          chronicleText: `You pulled ${sibling.name} out of danger. They screamed at you that night, but thanked you years later.`,
          valence: 'positive',
          npcInteraction: { npcId: sibling.id, type: 'rescued', severity: 10, domain: 'family' },
        },
        {
          id: eid(),
          text: 'Call your parents instead',
          effects: { karma: 5, reputation: -5 },
          chronicleText: `You called your parents about ${sibling.name}. The fallout was enormous but necessary.`,
          valence: 'neutral',
          npcInteraction: { npcId: sibling.id, type: 'reported_to_parents', severity: 8, domain: 'family' },
        },
        {
          id: eid(),
          text: 'Mind your own business — they can handle themselves',
          effects: { karma: -15, happiness: -5 },
          chronicleText: `You left ${sibling.name} to their fate. Nothing happened that night, but something inside you shifted.`,
          valence: 'negative',
          npcInteraction: { npcId: sibling.id, type: 'abandoned_in_danger', severity: 9, domain: 'family' },
        },
      ],
    });
  }

  // --- Event 7: The Scholarship Dilemma (age 17-19) ---
  if (classmate) {
    events.push({
      id: eid(),
      title: 'The Scholarship Dilemma',
      description: `You and ${classmate.name} are both finalists for the same scholarship. You discover they lied on their application. Reporting it guarantees you win.`,
      minAge: 17, maxAge: 19,
      stage: ['adolescence', 'young_adult'],
      choices: [
        {
          id: eid(),
          text: 'Report the lie — integrity matters',
          effects: { money: 15, karma: 5, reputation: 5, happiness: -3 },
          chronicleText: `You reported ${classmate.name}'s false application. You won the scholarship, but the victory tasted bitter.`,
          valence: 'neutral',
          npcInteraction: { npcId: classmate.id, type: 'exposed_lie', severity: 10, domain: 'academic' },
        },
        {
          id: eid(),
          text: 'Say nothing — let merit decide',
          effects: { karma: 8, happiness: -5 },
          chronicleText: `You kept silent about ${classmate.name}'s lie. They won the scholarship. You kept your conscience.`,
          valence: 'neutral',
          npcInteraction: { npcId: classmate.id, type: 'protected_secret', severity: 7, domain: 'academic' },
        },
      ],
    });
  }

  // --- Event 8: First Heartbreak (age 18-22) ---
  const romanceNPC: NPC = {
    id: eid(),
    name: randomName(),
    birthYear: state.birthYear + Math.floor(Math.random() * 3) - 1,
    relationship: 'romantic',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(romanceNPC.id, romanceNPC);

  events.push({
    id: eid(),
    title: 'First Heartbreak',
    description: `Your relationship with ${romanceNPC.name} has been intense but volatile. Tonight, during a heated argument, they give you an ultimatum: change who you are or they leave.`,
    minAge: 18, maxAge: 22,
    stage: ['young_adult'],
    choices: [
      {
        id: eid(),
        text: 'Compromise — relationships require sacrifice',
        effects: { happiness: -5, karma: 3 },
        chronicleText: `You bent to ${romanceNPC.name}'s demands. Peace returned, but a piece of you felt smaller.`,
        valence: 'neutral',
        npcInteraction: { npcId: romanceNPC.id, type: 'submitted', severity: 8, domain: 'romantic' },
      },
      {
        id: eid(),
        text: 'Refuse — you won\'t change who you are',
        effects: { happiness: -12, karma: 5, reputation: 3 },
        chronicleText: `You stood your ground. ${romanceNPC.name} left. The silence that followed was devastating.`,
        valence: 'negative',
        npcInteraction: { npcId: romanceNPC.id, type: 'broke_up', severity: 9, domain: 'romantic' },
      },
      {
        id: eid(),
        text: 'Suggest counseling — fight for what you have',
        effects: { happiness: 3, karma: 8, money: -5 },
        chronicleText: `You suggested working on things together. ${romanceNPC.name} was surprised, then moved.`,
        valence: 'positive',
        npcInteraction: { npcId: romanceNPC.id, type: 'fought_for_relationship', severity: 7, domain: 'romantic' },
      },
    ],
  });

  // --- Event 9: The Business Proposition (age 20-25) ---
  const businessNPC: NPC = {
    id: eid(),
    name: randomName(),
    birthYear: state.birthYear - 5,
    relationship: 'colleague',
    interactions: [],
    alive: true,
    metAtAge: state.currentAge,
  };
  newNPCs.set(businessNPC.id, businessNPC);

  events.push({
    id: eid(),
    title: 'The Business Proposition',
    description: `${businessNPC.name} approaches you with a business idea that's ethically grey but potentially very profitable. They need your skills and your silence.`,
    minAge: 20, maxAge: 25,
    stage: ['young_adult'],
    choices: [
      {
        id: eid(),
        text: 'Join them — fortune favors the bold',
        effects: { money: 20, karma: -15, reputation: -5 },
        chronicleText: `You joined ${businessNPC.name}'s scheme. The money rolled in, but you started sleeping with the lights on.`,
        valence: 'negative',
        npcInteraction: { npcId: businessNPC.id, type: 'joined_scheme', severity: 9, domain: 'financial' },
      },
      {
        id: eid(),
        text: 'Refuse and warn them of the risks',
        effects: { karma: 10, money: -3, happiness: 3 },
        chronicleText: `You turned down ${businessNPC.name} and urged caution. They called you naive. Time would tell who was right.`,
        valence: 'positive',
        npcInteraction: { npcId: businessNPC.id, type: 'refused_warned', severity: 8, domain: 'financial' },
      },
      {
        id: eid(),
        text: 'Report them anonymously',
        effects: { karma: 8, reputation: 3, money: -2 },
        chronicleText: `You reported ${businessNPC.name}'s scheme. They were investigated. They never found out it was you — or did they?`,
        valence: 'neutral',
        npcInteraction: { npcId: businessNPC.id, type: 'anonymous_report', severity: 10, domain: 'financial' },
      },
    ],
  });

  // --- Event 10: The Inheritance Dispute (age 20-25) ---
  if (sibling) {
    events.push({
      id: eid(),
      title: 'The Inheritance Dispute',
      description: `A grandparent passes away and leaves a significant sum. The will is ambiguous about the split between you and ${sibling.name}. You could claim the larger share and have a legal case.`,
      minAge: 20, maxAge: 25,
      stage: ['young_adult'],
      choices: [
        {
          id: eid(),
          text: 'Split it evenly — family over money',
          effects: { karma: 12, happiness: 5, money: 8 },
          chronicleText: `You split the inheritance equally with ${sibling.name}. They wept with gratitude.`,
          valence: 'positive',
          npcInteraction: { npcId: sibling.id, type: 'shared_fairly', severity: 8, domain: 'financial' },
        },
        {
          id: eid(),
          text: 'Take the larger share — you have the legal right',
          effects: { karma: -12, money: 18, happiness: -5 },
          chronicleText: `You claimed the larger share of the inheritance. ${sibling.name}'s face when they found out haunts you still.`,
          valence: 'negative',
          npcInteraction: { npcId: sibling.id, type: 'took_larger_share', severity: 10, domain: 'financial' },
        },
        {
          id: eid(),
          text: 'Give them all of it — you\'ll make your own way',
          effects: { karma: 18, money: -3, reputation: 8, happiness: 8 },
          chronicleText: `You gave the entire inheritance to ${sibling.name}. The act of generosity defined you.`,
          valence: 'positive',
          npcInteraction: { npcId: sibling.id, type: 'gave_everything', severity: 9, domain: 'financial' },
        },
      ],
    });
  }

  return { events: events.filter(e => state.currentAge >= e.minAge && state.currentAge <= e.maxAge), newNPCs };
}
