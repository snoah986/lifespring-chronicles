import { useGameStore } from '../store/gameStore';
export function useGameLoop() {
  const { setCurrentEvent } = useGameStore();
  const advanceLife = () => {
    setCurrentEvent({
      title: "Game Loaded",
      narrative: "The World Simulator is online. Database keys pending, but the engine is live.",
      choices: [{text: "Begin Journey", delta: {}}]
    });
  };
  return { advanceLife };
}
