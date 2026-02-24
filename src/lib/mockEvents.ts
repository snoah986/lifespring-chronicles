export const MOCK_EVENTS = [
  { id: 1, stage: 'infancy', age: 0, title: 'Welcome to the World', narrative: 'You take your first breath. Everything is bright and loud.', choices: [{text: 'Cry loudly', delta: {happiness: 10}}, {text: 'Sleep', delta: {fitness: 5}}] },
  { id: 2, stage: 'childhood', age: 5, title: 'The Sandbox', narrative: 'You see a factory in the distance. Your mum says your great-grandad built it.', choices: [{text: 'Ask about him', delta: {intelligence: 10}}, {text: 'Keep playing', delta: {social: 5}}] },
  { id: 3, stage: 'teen', age: 14, title: 'The Hustle', narrative: 'You start selling bottled water at the local park.', choices: [{text: 'Reinvest profit', delta: {wealth: 50}}, {text: 'Buy a game', delta: {happiness: 20}}] },
  { id: 4, stage: 'young_adult', age: 18, title: 'The Fork', narrative: 'You are at a crossroads. Football, Business, or the Streets?', choices: [{text: 'Football Academy', delta: {fitness: 30}}, {text: 'Start a Business', delta: {wealth: 100}}] }
];
