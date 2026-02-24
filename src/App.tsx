import React from 'react';
import { LandingPage } from './components/LandingPage';
import { GameContainer } from './components/GameContainer';
import { useGameStore } from './store/gameStore';

export default function App() {
  const { currentEvent } = useGameStore();
  const path = window.location.pathname;
  
  // If we are at /play, show the game. Otherwise, show Landing.
  return (
    <main className="bg-[#0a0a0a] min-h-screen selection:bg-[#c2410c]">
      {path === '/play' ? <GameContainer /> : <LandingPage />}
    </main>
  );
}
