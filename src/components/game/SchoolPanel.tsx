import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import { getCurrentSchoolStage, getExamAtAge } from '@/game/countries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { School, GraduationCap, Calendar } from 'lucide-react';

export const SchoolPanel: React.FC = () => {
  const { state } = useGameState();
  const { character, countryConfig } = state;

  if (!character || !countryConfig) return null;

  const currentStage = getCurrentSchoolStage(character.age, countryConfig);
  const upcomingExam = getExamAtAge(character.age, countryConfig);
  const nextStage = getCurrentSchoolStage(character.age + 1, countryConfig);

  const academicPerformance = character.stats.intelligence * 5 + (character.academicPerformance || 0);

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
              <span className="text-zinc-100 font-medium">{currentStage?.name || 'Not in School'}</span>
            </div>
            {currentStage && (
              <div className="text-xs text-zinc-500">
                Ages {currentStage.startAge}-{currentStage.endAge}
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
                <span className="text-sm font-medium text-zinc-200">Upcoming: {upcomingExam.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Calendar className="h-3 w-3" />
                <span>This year (Age {character.age})</span>
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                Required: {upcomingExam.difficulty} difficulty
              </div>
            </div>
          )}

          {nextStage && nextStage.name !== currentStage?.name && (
            <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-dashed border-zinc-700">
              <div className="text-xs text-zinc-400">Next Stage (Age {currentStage?.endAge + 1})</div>
              <div className="text-sm text-zinc-300 font-medium">{nextStage.name}</div>
            </div>
          )}

          {!currentStage && character.age > 18 && (
            <div className="text-sm text-zinc-500 italic">
              Education complete. Focus on your career.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolPanel;
