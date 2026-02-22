import type { GameState } from '@/game/types';
import { getCountry, getCurrentSchoolStage, getNextExam, isSchoolAge } from '@/game/countries';

interface SchoolPanelProps {
  state: GameState;
}

const SchoolPanel = ({ state }: SchoolPanelProps) => {
  const config = getCountry(state.country);
  const currentStage = getCurrentSchoolStage(config, state.currentAge);
  const nextExam = getNextExam(config, state.currentAge);
  const inSchool = isSchoolAge(config, state.currentAge);

  if (!inSchool) {
    return (
      <div className="p-4">
        <div className="panel-header -mx-4 px-4 mb-4">Education Record</div>
        <div className="space-y-3">
          <p className="font-mono text-xs text-muted-foreground">Your school years are behind you.</p>
          <div className="border border-border rounded p-3 space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Exams Completed</div>
            {config.exams.map(exam => {
              const taken = state.examsTaken.includes(exam.age);
              return (
                <div key={exam.age} className="flex items-center justify-between text-xs font-mono">
                  <span className={taken ? 'text-foreground' : 'text-muted-foreground line-through'}>{exam.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${taken ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                    {taken ? 'Completed' : 'Missed'}
                  </span>
                </div>
              );
            })}
          </div>
          {state.universityLocked && (
            <div className="border border-red-900/40 rounded p-2 bg-red-900/10">
              <p className="font-mono text-[10px] text-red-400 uppercase tracking-wider">University path closed</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const yearsInStage = currentStage ? state.currentAge - currentStage.startAge : 0;
  const stageLength = currentStage ? currentStage.endAge - currentStage.startAge + 1 : 1;
  const stageProgress = Math.round((yearsInStage / stageLength) * 100);

  return (
    <div className="p-4 space-y-4">
      <div className="panel-header -mx-4 px-4">School</div>

      {/* Current stage */}
      {currentStage && (
        <div className="border border-border rounded p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs text-foreground">{currentStage.name}</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              Year {yearsInStage + 1} of {stageLength}
            </span>
          </div>
          <div className="stat-bar-track">
            <div className="stat-bar" style={{ width: `${stageProgress}%`, backgroundColor: 'hsl(var(--stat-happiness))' }} />
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">
            {config.flag} {config.name} · {currentStage.name}
          </div>
        </div>
      )}

      {/* Academic intelligence (shown as a general performance indicator) */}
      <div className="border border-border rounded p-3 space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Academic Performance</div>
        <div className="flex justify-between items-center mb-1">
          <span className="font-mono text-[10px] text-muted-foreground">Overall</span>
          <span className="font-mono text-xs" style={{ color: getPerformanceColor(state.academicIntelligence) }}>
            {getPerformanceLabel(state.academicIntelligence)}
          </span>
        </div>
        <div className="stat-bar-track">
          <div className="stat-bar" style={{ width: `${state.academicIntelligence}%`, backgroundColor: getPerformanceColor(state.academicIntelligence) }} />
        </div>
      </div>

      {/* Upcoming exams */}
      <div className="border border-border rounded p-3 space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Exams</div>
        {config.exams.map(exam => {
          const taken = state.examsTaken.includes(exam.age);
          const isNext = nextExam?.age === exam.age;
          const yearsUntil = exam.age - state.currentAge;

          return (
            <div key={exam.age} className={`p-2 rounded border ${isNext ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
              <div className="flex justify-between items-center">
                <span className={`font-mono text-xs ${taken ? 'text-muted-foreground line-through' : isNext ? 'text-amber-400' : 'text-foreground'}`}>
                  {exam.name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">Age {exam.age}</span>
              </div>
              {!taken && (
                <p className="font-mono text-[10px] text-muted-foreground mt-1">{exam.subject}</p>
              )}
              {!taken && isNext && yearsUntil > 0 && (
                <p className="font-mono text-[10px] text-amber-400/70 mt-1">
                  {yearsUntil} year{yearsUntil !== 1 ? 's' : ''} away
                </p>
              )}
              {!taken && isNext && yearsUntil === 0 && (
                <p className="font-mono text-[10px] text-amber-400 mt-1">This year — advance to sit the exam</p>
              )}
              {taken && (
                <span className="font-mono text-[10px] text-green-400">✓ Completed age {exam.age}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function getPerformanceLabel(score: number): string {
  if (score >= 80) return 'Exceptional';
  if (score >= 65) return 'Strong';
  if (score >= 50) return 'Average';
  if (score >= 35) return 'Below Average';
  return 'Struggling';
}

function getPerformanceColor(score: number): string {
  if (score >= 70) return '#4ade80';
  if (score >= 50) return '#facc15';
  if (score >= 35) return '#fb923c';
  return '#f87171';
}

export default SchoolPanel;
