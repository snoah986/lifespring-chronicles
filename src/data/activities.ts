export const ACTIVITIES = {
  ACADEMY: [
    { id: 'a_01', minAge: 3, maxAge: 5, label: 'Coloring Books', effects: { intelligence: 2, focus: 3 }, desc: 'Practice staying within the lines.' },
    { id: 'a_02', minAge: 4, maxAge: 6, label: 'Read with Parents', effects: { intelligence: 5, social: 2 }, desc: 'Absorb the basics of literacy.' }
  ],
  STADIUM: [
    { id: 's_01', minAge: 3, maxAge: 6, label: 'Running Drills', effects: { fitness: 5, health: 2 }, desc: 'Basic coordination and speed work.' },
    { id: 's_02', minAge: 5, maxAge: 10, label: 'Youth Football', effects: { fitness: 3, social: 5 }, desc: 'Join a local Wembley youth team.' }
  ],
  HUSTLE: [
    { id: 'h_01', minAge: 6, maxAge: 12, label: 'Household Chores', effects: { wealth: 2, focus: 2 }, desc: 'Earn a small allowance for helping out.' }
  ]
};

export const NARRATIVE_EVENTS = {
  0: { title: 'First Breath', narrative: 'The simulation begins. You are a biological anomaly in Wembley.', choices: [{ text: 'Observe', effects: { focus: 5 } }] },
  3: { title: 'The Sandbox', narrative: 'You notice the other kids are slower than you. How do you spend your time?', choices: [
    { text: 'Lead the Group', effects: { influence: 5, social: 5 } },
    { text: 'Study the Toys', effects: { intelligence: 5, focus: 5 } },
    { text: 'Climb the Fence', effects: { fitness: 5, health: -2 } }
  ]}
};
