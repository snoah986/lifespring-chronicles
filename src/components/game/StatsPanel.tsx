import { useState } from 'react';
import type { GameState, NPC, Interaction } from '@/game/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

const ValenceDot = ({ valence }: { valence: string }) => {
  const colorMap: Record<string, string> = {
    positive: 'hsl(var(--event-positive))',
    negative: 'hsl(var(--event-negative))',
    neutral: 'hsl(var(--event-neutral))',
  };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-2 flex-shrink-0 mt-1"
      style={{ backgroundColor: colorMap[valence] || colorMap.neutral }}
    />
  );
};

const InteractionEntry = ({ interaction }: { interaction: Interaction }) => (
  <div className="flex items-start py-2 border-b border-border last:border-0">
    <ValenceDot valence={interaction.valence} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Age {interaction.playerAge}
        </span>
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground">
          {interaction.domain}
        </span>
      </div>
      <p className="text-xs text-foreground mt-1">{interaction.description}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] font-mono text-muted-foreground">
          Severity: {interaction.severity}/10
        </span>
      </div>
    </div>
  </div>
);

const NPCDetailModal = ({ npc, open, onClose, birthYear }: { npc: NPC; open: boolean; onClose: () => void; birthYear: number }) => {
  const npcAge = birthYear + (new Date().getFullYear() - birthYear) - npc.birthYear;
  
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border text-foreground max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm uppercase tracking-widest text-foreground flex items-center gap-3">
            {npc.name}
            <span className="npc-tag">{npc.relationship}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-2">
          <div className="flex gap-4 text-xs font-mono text-muted-foreground">
            <span>Born: {npc.birthYear}</span>
            <span>Met at age: {npc.metAtAge}</span>
            <span>{npc.alive ? 'Alive' : 'Deceased'}</span>
          </div>

          <div className="panel-header -mx-6 px-6">
            Interaction History ({npc.interactions.length})
          </div>

          {npc.interactions.length === 0 ? (
            <p className="text-xs text-muted-foreground font-mono py-2">No significant interactions recorded.</p>
          ) : (
            <div className="space-y-0">
              {npc.interactions.map((interaction, idx) => (
                <InteractionEntry key={idx} interaction={interaction} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const NPCEntry = ({ npc, onClick }: { npc: NPC; onClick: () => void }) => {
  const lastInteraction = npc.interactions.length > 0 
    ? npc.interactions[npc.interactions.length - 1] 
    : null;

  return (
    <div
      className="py-2 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 -mx-3 px-3 transition-colors duration-150"
      onClick={onClick}
    >
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
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);

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
          <NPCEntry key={npc.id} npc={npc} onClick={() => setSelectedNPC(npc)} />
        ))}
      </div>

      {/* NPC Detail Modal */}
      {selectedNPC && (
        <NPCDetailModal
          npc={selectedNPC}
          open={!!selectedNPC}
          onClose={() => setSelectedNPC(null)}
          birthYear={state.birthYear}
        />
      )}
    </div>
  );
};

export default StatsPanel;
