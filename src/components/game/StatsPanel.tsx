import type { GameState, NPC } from '@/game/types';

interface StatsPanelProps {
  state: GameState;
}

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-mono text-xs" style={{ color }}>{value}</span>
    </div>
    <div className="stat-bar-track">
      <div
        className="stat-bar"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const NPCEntry = ({ npc }: { npc: NPC }) => {
  const age = npc.birthYear ? new Date().getFullYear() - npc.birthYear : '?';
  const lastInteraction = npc.interactions.length > 0 
    ? npc.interactions[npc.interactions.length - 1] 
    : null;

  return (
    <div className="py-2 border-b border-border last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground">{npc.name}</span>
        <span className="npc-tag">{npc.relationship}</span>
      </div>
      {lastInteraction && (
        <p className="text-[10px] text-muted-foreground mt-1 font-mono truncate">
          Age {lastInteraction.playerAge}: {lastInteraction.type.replace(/_/g, ' ')}
        </p>
      )}
    </div>
  );
};

const StatsPanel = ({ state }: StatsPanelProps) => {
  return (
    <div className="bg-card border-r border-border overflow-y-auto">
      {/* Stats */}
      <div className="panel-header">Character Stats</div>
      <div className="p-3">
        <StatBar label="Health" value={state.stats.health} color="hsl(var(--stat-health))" />
        <StatBar label="Happiness" value={state.stats.happiness} color="hsl(var(--stat-happiness))" />
        <StatBar label="Money" value={state.stats.money} color="hsl(var(--stat-money))" />
        <StatBar label="Reputation" value={state.stats.reputation} color="hsl(var(--stat-reputation))" />
      </div>

      {/* NPCs */}
      <div className="panel-header">
        People ({state.npcs.length})
      </div>
      <div className="p-3">
        {state.npcs.map(npc => (
          <NPCEntry key={npc.id} npc={npc} />
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;
