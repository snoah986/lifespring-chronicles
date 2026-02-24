export interface TimeBlock {
  id: string;
  type: 'work' | 'study' | 'leisure' | 'family';
  duration: number; // in hours
}

export function calculateBurnout(blocks: TimeBlock[]) {
  const totalHours = blocks.reduce((acc, b) => acc + b.duration, 0);
  return totalHours > 12 ? (totalHours - 12) * 5 : 0; // Mental Health penalty
}
