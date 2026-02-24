import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { IdentityConfig } from './components/IdentityConfig';
import { BirthCertificate } from './components/BirthCertificate';
import { GameContainer } from './components/GameContainer';

export default function App() {
  const [view, setView] = useState('landing'); // landing, config, birth, play

  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      {view === 'landing' && <LandingPage onComplete={() => setView('config')} />}
      {view === 'config' && <IdentityConfig onComplete={() => setView('birth')} />}
      {view === 'birth' && <BirthCertificate onStart={() => setView('play')} />}
      {view === 'play' && <GameContainer />}
    </main>
  );
}
