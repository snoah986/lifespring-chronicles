import type { GameState } from '@/game/types';

interface DeathScreenProps {
  state: GameState;
  onRestart: () => void;
}

const DeathScreen = ({ state, onRestart }: DeathScreenProps) => {
  const karmaLabel = state.stats.karma > 30 ? 'Virtuous' 
    : state.stats.karma > 10 ? 'Good' 
    : state.stats.karma > -10 ? 'Neutral'
    : state.stats.karma > -30 ? 'Troubled'
    : 'Dark';

  return (
    <div className="start-screen">
      <div className="text-center animate-fade-in max-w-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          End of Life
        </p>
        <h1 className="font-mono text-4xl font-bold text-foreground mb-2">
          {state.playerName}
        </h1>
        <p className="font-mono text-sm text-muted-foreground mb-8">
          {state.birthYear} — {state.birthYear + state.currentAge}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 text-left">
          {[
            { label: 'Final Age', value: state.currentAge.toString() },
            { label: 'Health', value: `${state.stats.health}%` },
            { label: 'Happiness', value: `${state.stats.happiness}%` },
            { label: 'Wealth', value: `${state.stats.money}%` },
            { label: 'Reputation', value: `${state.stats.reputation}%` },
            { label: 'Karma', value: karmaLabel },
            { label: 'People Met', value: state.npcs.length.toString() },
            { label: 'Events', value: state.chronicle.length.toString() },
          ].map(stat => (
            <div key={stat.label} className="panel p-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">
                {stat.label}
              </span>
              <span className="font-mono text-lg text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>

        <button onClick={onRestart} className="next-year-btn">
          Live Again
        </button>
      </div>
    </div>
  );
};

export default DeathScreen;
