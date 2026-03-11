export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0xDE11e4C57a078128a9B21233C97Ab820743dC0eA';

export const NETWORK_CONFIG = {
  chainId: '0xaa36a7', // 11155111 in hex
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [process.env.RPC_URL || ''],
  blockExplorerUrls: [process.env.BLOCK_EXPLORER_URL || ''],
};

export const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/'; 