import type { StatBlock, LifeStage } from '../types';
import { clamp } from '../lib/utils';

export function applyStatDeltas(currentStats: StatBlock, deltas: Partial<StatBlock>): StatBlock {
  return {
    health: clamp(currentStats.health + (deltas.health || 0), 0, 100),
    happiness: clamp(currentStats.happiness + (deltas.happiness || 0), 0, 100),
    wealth: clamp(currentStats.wealth + (deltas.wealth || 0), 0, 100),
    intelligence: clamp(currentStats.intelligence + (deltas.intelligence || 0), 0, 100),
    social: clamp(currentStats.social + (deltas.social || 0), 0, 100),
    creativity: clamp(currentStats.creativity + (deltas.creativity || 0), 0, 100),
    fitness: clamp(currentStats.fitness + (deltas.fitness || 0), 0, 100),
    spirituality: clamp(currentStats.spirituality + (deltas.spirituality || 0), 0, 100),
    resilience: clamp(currentStats.resilience + (deltas.resilience || 0), 0, 100),
    wisdom: clamp(currentStats.wisdom + (deltas.wisdom || 0), 0, 100),
    reputation: clamp(currentStats.reputation + (deltas.reputation || 0), 0, 100),
    mental_health: clamp(currentStats.mental_health + (deltas.mental_health || 0), 0, 100),
  };
}

export function calculateDecay(stats: StatBlock, age: number, stage: LifeStage): Partial<StatBlock> {
  const decay: Partial<StatBlock> = {};
  if (age > 30) {
    decay.fitness = -0.5;
    decay.health = -0.2;
  }
  return decay;
}

export function normalizeWealthStat(netWorth: number): number {
  if (netWorth <= -50000) return 0;
  if (netWorth >= 5000000) return 100;
  if (netWorth < 0) return Math.floor(30 + (netWorth / 100000 * 30));
  if (netWorth < 100000) return Math.floor(30 + (netWorth / 100000 * 20));
  if (netWorth < 500000) return Math.floor(50 + ((netWorth - 100000) / 400000 * 20));
  if (netWorth < 1000000) return Math.floor(70 + ((netWorth - 500000) / 500000 * 20));
  return Math.floor(90 + ((netWorth - 1000000) / 4000000 * 10));
}
