export function calculateCryptoVolatilty(trend: number) {
  const randomShock = Math.random() * 2 - 1; // -100% to +100%
  return trend + randomShock;
}
