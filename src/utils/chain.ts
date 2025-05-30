export const BASE_CHAIN_ID = 8453;

export function isBaseChain(chainId: string | number | undefined): boolean {
  if (!chainId) return false;
  if (typeof chainId === 'string') return parseInt(chainId, 16) === BASE_CHAIN_ID || parseInt(chainId) === BASE_CHAIN_ID;
  return chainId === BASE_CHAIN_ID;
} 