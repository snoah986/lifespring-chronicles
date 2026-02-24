export function handleMartialLaw(stability: number, heat: number) {
  return {
    rebellionRisk: heat * 1.5,
    budgetControl: 1.0, // 100% control
    isDictator: stability < 40
  };
}
