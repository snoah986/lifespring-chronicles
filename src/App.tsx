import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { BirthCertificate } from './components/BirthCertificate';
import { GameContainer } from './components/GameContainer';

export default function App() {
  const [view, setView] = useState('landing'); // landing, birth, play

  return (
    <main className="bg-[#0a0a0a] min-h-screen selection:bg-[#c2410c]">
      {view === 'landing' && <LandingPage onComplete={() => setView('birth')} />}
      {view === 'birth' && <BirthCertificate onStart={() => setView('play')} />}
      {view === 'play' && <GameContainer />}
    </main>
  );
}
