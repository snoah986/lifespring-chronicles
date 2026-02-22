import { useState, useCallback } from 'react';
import CountrySelect from '@/components/game/CountrySelect';
import TopBar from '@/components/game/TopBar';
import StatsPanel from '@/components/game/StatsPanel';
import EventFeed from '@/components/game/EventFeed';
import Chronicle from '@/components/game/Chronicle';
import DeathScreen from '@/components/game/DeathScreen';
import SchoolPanel from '@/components/game/SchoolPanel';
import JobMarketPanel from '@/components/game/JobMarketPanel';
import { createInitialState, selectEventForAge, applyChoice, advanceYear, applyForJob, quitJob } from '@/game/engine';
import { isSchoolAge, getCountry } from '@/game/countries';
import type { GameState, EventChoice } from '@/game/types';
import type { CountryCode } from '@/game/countries';

type Tab = 'life' | 'school' | 'jobs';

const Index = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('life');

  const handleStart = useCallback((name: string, country: CountryCode) => {
    let state = createInitialState(name, country);
    state = selectEventForAge(state);
    setGameState(state);
    setActiveTab('life');
  }, []);

  const handleChoice = useCallback((choice: EventChoice) => {
    setGameState(prev => prev ? applyChoice(prev, choice) : prev);
  }, []);

  const handleAdvanceYear = useCallback(() => {
    setGameState(prev => prev ? advanceYear(prev) : prev);
    setActiveTab('life');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState(null);
    setActiveTab('life');
  }, []);

  const handleApplyForJob = useCallback((tierIndex: number, titleIndex: number) => {
    setGameState(prev => prev ? applyForJob(prev, tierIndex, titleIndex) : prev);
    setActiveTab('life');
  }, []);

  const handleQuitJob = useCallback(() => {
    setGameState(prev => prev ? quitJob(prev) : prev);
  }, []);

  if (!gameState) {
    return <CountrySelect onSelect={handleStart} />;
  }

  if (gameState.phase === 'dead') {
    return <DeathScreen state={gameState} onRestart={handleRestart} />;
  }

  const config = getCountry(gameState.country);
  const inSchool = isSchoolAge(config, gameState.currentAge);
  const hasEvent = !!gameState.currentEvent;

  return (
    <div className="game-grid">
      <TopBar
        state={gameState}
        onAdvanceYear={handleAdvanceYear}
        canAdvance={!hasEvent}
      />

      <StatsPanel state={gameState} />

      {/* Main content area with tabs */}
      <div className="flex flex-col overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-border bg-card">
          <TabButton label="Life" active={activeTab === 'life'} onClick={() => setActiveTab('life')} alert={hasEvent} />
          {inSchool && (
            <TabButton label="School" active={activeTab === 'school'} onClick={() => setActiveTab('school')} />
          )}
          {gameState.currentAge >= config.minimumWorkingAge && (
            <TabButton label={config.jobMarketLabel} active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} />
          )}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'life' && (
            <EventFeed
              currentEvent={gameState.currentEvent}
              onChoice={handleChoice}
            />
          )}
          {activeTab === 'school' && (
            <SchoolPanel state={gameState} />
          )}
          {activeTab === 'jobs' && (
            <JobMarketPanel
              state={gameState}
              onApply={handleApplyForJob}
              onQuit={handleQuitJob}
            />
          )}
        </div>
      </div>

      <Chronicle entries={gameState.chronicle} />
    </div>
  );
};

const TabButton = ({
  label, active, onClick, alert,
}: {
  label: string; active: boolean; onClick: () => void; alert?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors border-r border-border last:border-r-0 ${
      active
        ? 'text-foreground bg-background'
        : 'text-muted-foreground hover:text-foreground bg-card'
    }`}
  >
    {label}
    {alert && (
      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
    )}
  </button>
);

export default Index;
