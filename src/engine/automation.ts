export function optimizeSchedule(career: string, health: number) {
  if (health < 20) return [{ type: 'leisure', duration: 12 }];
  return career === 'athlete' ? 
    [{ type: 'work', duration: 8 }, { type: 'leisure', duration: 4 }] : 
    [{ type: 'work', duration: 10 }, { type: 'leisure', duration: 2 }];
}
