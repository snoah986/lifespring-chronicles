export interface Policy {
  name: string;
  type: 'democracy' | 'autocracy';
  stabilityImpact: number;
}

export function calculateWarRisk(militaryFunding: number, aggressionLevel: number) {
  return (militaryFunding * 0.4) + (aggressionLevel * 0.6);
}
