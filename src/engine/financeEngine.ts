export function calculateTax(income: number, country: string) {
  // Alternative History Tax Brackets
  if (income > 150000) return income * 0.45;
  if (income > 50000) return income * 0.20;
  return income * 0.10;
}

export function applyDebtInterest(liability: number, globalTrend: number) {
  const rate = 0.05 + (globalTrend * 0.02);
  return liability * (1 + rate);
}
