import React from 'react';
import { MainMenu } from './pages/MainMenu';
import { NewGame } from './pages/NewGame';
import { Game } from './pages/Game';

function App() {
  const path = window.location.pathname;

  if (path === '/new-game') return <NewGame />;
  if (path === '/game') return <Game />;
  
  return <MainMenu />;
}

export default App;
