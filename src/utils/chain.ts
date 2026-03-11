export const SEPOLIA_CHAIN_ID = 11155111;

export function isSepoliaChain(chainId: string | number | undefined): boolean {
  if (!chainId) return false;
  if (typeof chainId === 'string') return parseInt(chainId, 16) === SEPOLIA_CHAIN_ID || parseInt(chainId) === SEPOLIA_CHAIN_ID;
  return chainId === SEPOLIA_CHAIN_ID;
} 