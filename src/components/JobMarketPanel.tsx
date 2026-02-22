import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  tier: 'entry' | 'mid' | 'senior';
  salary: number;
  requirements: {
    intelligence?: number;
    reputation?: number;
  };
  description: string;
}

export const JobMarketPanel: React.FC = () => {
  const { state, dispatch } = useGameState();
  const { character, countryConfig } = state;
  const [applyingFor, setApplyingFor] = useState<string | null>(null);

  if (!character || !countryConfig) return null;

  // Generate available jobs based on character age and stats
  const availableJobs: Job[] = [
    {
      id: 'retail',
      title: 'Retail Assistant',
      tier: 'entry',
      salary: 18000,
      requirements: {},
      description: 'Entry-level customer service position.'
    },
    {
      id: 'office',
      title: 'Office Administrator',
      tier: 'entry',
      salary: 22000,
      requirements: { intelligence: 5 },
      description: 'General office duties and admin work.'
    },
    {
      id: 'trades',
      title: 'Apprentice Tradesperson',
      tier: 'entry',
      salary: 20000,
      requirements: {},
      description: 'Learn a skilled trade on the job.'
    },
    {
      id: 'corporate',
      title: 'Junior Analyst',
      tier: 'mid',
      salary: 35000,
      requirements: { intelligence: 8, reputation: 5 },
      description: 'Corporate office role requiring qualifications.'
    },
    {
      id: 'manager',
      title: 'Department Manager',
      tier: 'mid',
      salary: 45000,
      requirements: { intelligence: 7, reputation: 7 },
      description: 'Manage a team and oversee operations.'
    },
    {
      id: 'executive',
      title: 'Senior Executive',
      tier: 'senior',
      salary: 80000,
      requirements: { intelligence: 12, reputation: 10 },
      description: 'High-level strategic leadership role.'
    }
  ];

  const calculateSuccessChance = (job: Job): number => {
    if (!job.requirements.intelligence && !job.requirements.reputation) return 90;
    
    let score = 50;
    if (job.requirements.intelligence) {
      const diff = character.stats.intelligence - job.requirements.intelligence;
      score += diff * 10;
    }
    if (job.requirements.reputation) {
      const diff = character.stats.reputation - job.requirements.reputation;
      score += diff * 5;
    }
    
    // Academic performance bonus
    score += (character.academicPerformance || 0) * 0.2;
    
    return Math.min(95, Math.max(10, score));
  };

  const handleApply = (job: Job) => {
    setApplyingFor(job.id);
    const chance = calculateSuccessChance(job);
    const roll = Math.random() * 100;
    
    setTimeout(() => {
      if (roll <= chance) {
        dispatch({
          type: 'SET_JOB',
          payload: {
            title: job.title,
            salary: job.salary,
            tier: job.tier
          }
        });
      }
      setApplyingFor(null);
    }, 500);
  };

  const handleQuit = () => {
    dispatch({ type: 'QUIT_JOB' });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'entry': return 'bg-green-600';
      case 'mid': return 'bg-blue-600';
      case 'senior': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  if (character.job) {
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
                <div className="text-lg font-medium text-zinc-100">{character.job.title}</div>
                <Badge className={`${getTierColor(character.job.tier)} mt-1`}>
                  {character.job.tier.toUpperCase()}
                </Badge>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-400">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-lg font-bold">{character.job.salary.toLocaleString()}</span>
                </div>
                <div className="text-xs text-zinc-500">per year</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-zinc-700">
              <Button 
                variant="destructive" 
                onClick={handleQuit}
                className="w-full"
              >
                Quit Job
              </Button>
            </div>
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
        <CardContent className="space-y-3">
          {availableJobs.map((job) => {
            const chance = calculateSuccessChance(job);
            const meetsReqs = chance >= 50;
            
            return (
              <div 
                key={job.id} 
                className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-zinc-100">{job.title}</div>
                    <div className="text-xs text-zinc-400">{job.description}</div>
                  </div>
                  <Badge className={`${getTierColor(job.tier)} text-xs`}>
                    {job.tier}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-400">
                    <DollarSign className="h-3 w-3" />
                    <span>{job.salary.toLocaleString()}</span>
                  </div>
                  <div className="text-zinc-500">|</div>
                  <div className="text-zinc-400">
                    Success: {Math.round(chance)}%
                  </div>
                </div>

                {job.requirements.intelligence && (
                  <div className="flex items-center gap-2 text-xs">
                    <AlertCircle className="h-3 w-3 text-zinc-500" />
                    <span className={character.stats.intelligence >= job.requirements.intelligence ? 'text-green-400' : 'text-red-400'}>
                      INT {job.requirements.intelligence}+ 
                      ({character.stats.intelligence >= job.requirements.intelligence ? '✓' : '✗'})
                    </span>
                  </div>
                )}

                <Button 
                  onClick={() => handleApply(job)}
                  disabled={applyingFor === job.id || !meetsReqs}
                  className="w-full mt-2"
                  variant={meetsReqs ? "default" : "secondary"}
                >
                  {applyingFor === job.id ? 'Applying...' : meetsReqs ? 'Apply' : 'Requirements Not Met'}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobMarketPanel;
