import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
  const { gameState, incrementAge, setCurrentEvent } = useGameStore();

  const generateEvent = (age) => {
    const themes = ['Academic', 'Social', 'Physical', 'Financial', 'Risk'];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    return {
      title: `${theme} Encounter: Year ${age}`,
      narrative: `A significant ${theme.toLowerCase()} opportunity has emerged in ${gameState.location}. How do you proceed?`,
      choices: [
        { text: 'Calculated Approach', effects: { intelligence: 5, stress: 2 } },
        { text: 'Aggressive Expansion', effects: { wealth: 10, stress: 10, happiness: -5 } },
        { text: 'Passive Observation', effects: { focus: 5, social: -2 } }
      ]
    };
  };

  const advanceLife = () => {
    incrementAge();
    setCurrentEvent(generateEvent(gameState.current_age + 1));
  };

  return { advanceLife };
}
