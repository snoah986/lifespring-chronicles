import { getLifeStage, getLifeStageLabel, type GameState } from '@/game/types';

interface TopBarProps {
  state: GameState;
  onAdvanceYear: () => void;
  canAdvance: boolean;
}

const TopBar = ({ state, onAdvanceYear, canAdvance }: TopBarProps) => {
  const stage = getLifeStage(state.currentAge);
  const stageLabel = getLifeStageLabel(stage);
  const calendarYear = state.birthYear + state.currentAge;

  return (
    <div className="col-span-2 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {state.playerName}
          </span>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="age-badge">{state.currentAge}</span>
            <span className="font-mono text-xs text-muted-foreground">years old</span>
          </div>
        </div>
        
        <div className="h-8 w-px bg-border" />
        
        <div>
          <span className="life-stage-label">{stageLabel}</span>
          <div className="font-mono text-[10px] text-muted-foreground mt-1">
            {calendarYear}
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Career
          </span>
          <div className="font-mono text-xs text-foreground mt-0.5">
            {state.career}
          </div>
        </div>
      </div>

      <button
        onClick={onAdvanceYear}
        disabled={!canAdvance}
        className="next-year-btn disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next Year →
      </button>
    </div>
  );
};

export default TopBar;
