import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import { getCurrentSchoolStage, getExamAtAge } from '@/game/countries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { School, GraduationCap, Calendar } from 'lucide-react';

export const SchoolPanel: React.FC = () => {
  const { state } = useGameState();
  
  // ABSOLUTE FIRST THING: Defensive check before ANY derivation
  if (!state?.character || !state?.countryConfig) {
    return (
      <div className="space-y-4">
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <School className="h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-400 italic">
              Start a new game to view education details.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // NOW safe to destructure and derive (AFTER the check)
  const { character, countryConfig } = state;
  const age = character?.age ?? 0;
  const academicPerformance = (character?.stats?.intelligence ?? 0) * 5 + (character?.academicPerformance ?? 0);
  
  // Safe helper function calls with fallbacks
  const currentStage = age > 0 ? getCurrentSchoolStage(age, countryConfig) : null;
  const upcomingExam = age > 0 ? getExamAtAge(age, countryConfig) : null;
  const nextStage = age > 0 ? getCurrentSchoolStage(age + 1, countryConfig) : null;

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <School className="h-5 w-5" />
            Education Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Current Stage</span>
              <span className="text-zinc-100 font-medium">{currentStage?.name ?? 'Not in School'}</span>
            </div>
            {currentStage && (
              <div className="text-xs text-zinc-500">
                Ages {currentStage?.startAge ?? 0}-{currentStage?.endAge ?? 0}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Academic Performance</span>
              <span className="text-zinc-100">{Math.round(academicPerformance)}%</span>
            </div>
            <Progress value={academicPerformance} className="h-2 bg-zinc-800" />
          </div>

          {upcomingExam && (
            <div className="mt-4 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-zinc-200">Upcoming: {upcomingExam?.name ?? 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Calendar className="h-3 w-3" />
                <span>This year (Age {age})</span>
              </div>
            </div>
          )}

          {nextStage && nextStage?.name !== currentStage?.name && (
            <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-dashed border-zinc-700">
              <div className="text-xs text-zinc-400">Next Stage</div>
              <div className="text-sm text-zinc-300 font-medium">{nextStage?.name ?? 'Unknown'}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolPanel;
