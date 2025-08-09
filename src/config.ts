export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

export const NETWORK_CONFIG = {
  chainId: '0x2105', // 8453 in hex
  chainName: 'Base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [process.env.RPC_URL || ''],
  blockExplorerUrls: [process.env.BLOCK_EXPLORER_URL || ''],
};

export const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/'; 