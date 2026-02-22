import { useState } from 'react';
import type { GameState } from '@/game/types';
import { getCountry, getEligibleJobs, formatSalary, JobTier } from '@/game/countries';

interface JobMarketPanelProps {
  state: GameState;
  onApply: (tierIndex: number, titleIndex: number) => void;
  onQuit: () => void;
}

const JobMarketPanel = ({ state, onApply, onQuit }: JobMarketPanelProps) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<number>(0);
  const [applying, setApplying] = useState(false);

  const config = getCountry(state.country);
  const eligibleJobs = getEligibleJobs(
    config,
    state.currentAge,
    state.academicIntelligence,
    state.stats.reputation,
    state.universityLocked
  );

  const tooYoung = state.currentAge < config.minimumWorkingAge;

  const handleApply = () => {
    if (selectedTier === null) return;
    setApplying(true);
    setTimeout(() => {
      onApply(selectedTier, selectedTitle);
      setApplying(false);
      setSelectedTier(null);
    }, 300);
  };

  if (tooYoung) {
    return (
      <div className="p-4">
        <div className="panel-header -mx-4 px-4 mb-4">{config.jobMarketLabel}</div>
        <div className="border border-border rounded p-4 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            You must be at least {config.minimumWorkingAge} to enter the job market.
          </p>
          <p className="font-mono text-[10px] text-muted-foreground mt-2">
            Focus on school for now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="panel-header -mx-4 px-4">{config.jobMarketLabel}</div>

      {/* Current employment status */}
      <div className="border border-border rounded p-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Current Status</div>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-mono text-sm text-foreground">{state.careerTitle}</div>
            {state.isEmployed && state.annualSalary > 0 && (
              <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                {formatSalary(config, state.annualSalary / config.salaryMultiplier)} per year
              </div>
            )}
          </div>
          <div className={`font-mono text-[10px] px-2 py-1 rounded ${state.isEmployed ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {state.isEmployed ? 'Employed' : 'Unemployed'}
          </div>
        </div>
        {state.isEmployed && (
          <button
            onClick={onQuit}
            className="mt-3 w-full border border-red-900/50 text-red-400 font-mono text-[10px] uppercase tracking-wider py-1.5 rounded hover:bg-red-900/20 transition-colors"
          >
            Quit Job
          </button>
        )}
      </div>

      {/* Job listings */}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Available Positions</div>

        {config.jobTiers.map((tier, tierIdx) => {
          const isEligible = eligibleJobs.some(j => j.tier === tier.tier);
          const isSelected = selectedTier === tierIdx;

          return (
            <div
              key={tier.tier}
              className={`mb-2 border rounded transition-all ${
                isSelected
                  ? 'border-amber-500/60 bg-amber-500/5'
                  : isEligible
                  ? 'border-border hover:border-muted-foreground cursor-pointer'
                  : 'border-border/40 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isEligible && setSelectedTier(isSelected ? null : tierIdx)}
            >
              <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-mono text-xs ${isEligible ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {tier.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Tier {tier.tier}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mb-2">
                  From {formatSalary(config, tier.baseSalary)}/yr
                </div>

                {/* Requirements */}
                <div className="flex flex-wrap gap-1">
                  {tier.requiresUniversity && (
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${!state.universityLocked ? 'bg-blue-900/30 text-blue-400' : 'bg-red-900/30 text-red-400'}`}>
                      Degree required
                    </span>
                  )}
                  {tier.minAcademic > 0 && (
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${state.academicIntelligence >= tier.minAcademic ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      Academic {tier.minAcademic}+
                    </span>
                  )}
                  {tier.minReputation > 0 && (
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${state.stats.reputation >= tier.minReputation ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      Rep {tier.minReputation}+
                    </span>
                  )}
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${state.currentAge >= tier.minAge ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    Age {tier.minAge}+
                  </span>
                </div>

                {/* Title selector when this tier is selected */}
                {isSelected && isEligible && (
                  <div className="mt-3 space-y-1">
                    <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Select Position</div>
                    {tier.titles.map((title, tIdx) => (
                      <div
                        key={tIdx}
                        onClick={e => { e.stopPropagation(); setSelectedTitle(tIdx); }}
                        className={`px-2 py-1.5 rounded cursor-pointer font-mono text-xs transition-colors ${
                          selectedTitle === tIdx
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                            : 'bg-background text-foreground hover:bg-muted/50 border border-transparent'
                        }`}
                      >
                        {title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {eligibleJobs.length === 0 && (
          <div className="border border-border rounded p-4 text-center">
            <p className="font-mono text-xs text-muted-foreground">No positions available yet.</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-1">Improve your academics or reputation to unlock listings.</p>
          </div>
        )}
      </div>

      {/* Apply button */}
      {selectedTier !== null && (
        <button
          onClick={handleApply}
          disabled={applying}
          className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-black font-mono text-xs uppercase tracking-widest py-2.5 rounded transition-colors"
        >
          {applying ? 'Submitting...' : `Apply for ${config.jobTiers[selectedTier]?.titles[selectedTitle] ?? 'Position'}`}
        </button>
      )}
    </div>
  );
};

export default JobMarketPanel;
