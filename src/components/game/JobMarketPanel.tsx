import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, TrendingUp } from 'lucide-react';

export const JobMarketPanel: React.FC = () => {
  const { state, dispatch } = useGameState();
  const [applyingFor, setApplyingFor] = useState<string | null>(null);

  // ABSOLUTE FIRST THING: Check if game started
  if (!state?.character || !state?.countryConfig) {
    return (
      <div className="space-y-4">
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Market
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-400 italic">
              Start a new game to view job listings.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { character } = state;
  const hasJob = !!character?.job;

  // Safe derived values with fallbacks
  const intelligence = character?.stats?.intelligence ?? 0;
  const reputation = character?.stats?.reputation ?? 0;
  const currentSalary = character?.job?.salary ?? 0;

  const handleQuit = () => {
    if (dispatch) {
      dispatch({ type: 'QUIT_JOB' });
    }
  };

  if (hasJob) {
    return (
      <div className="space-y-4">
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Current Employment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-medium text-zinc-100">{character?.job?.title ?? 'Unknown'}</div>
                <Badge className="bg-blue-600 mt-1">{character?.job?.tier?.toUpperCase() ?? 'UNKNOWN'}</Badge>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-400">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-lg font-bold">{currentSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Button variant="destructive" onClick={handleQuit} className="w-full">Quit Job</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Job Market
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-zinc-400">
            Available jobs will appear here based on your stats:
            <div className="mt-2 text-xs text-zinc-500">
              INT: {intelligence} | REP: {reputation}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobMarketPanel;
