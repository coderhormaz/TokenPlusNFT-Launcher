import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

// Token Factory ABI - only the functions we need
const TOKEN_FACTORY_ABI = [
  'function createToken(string memory name, string memory symbol, uint256 initialSupply, address recipient) public returns (address)',
  'function getTokenInfo(address tokenAddress) public view returns (string memory name, string memory symbol, uint256 totalSupply)'
];

// Token ABI - only the functions we need
export const TOKEN_ABI = [
  'function name() public view returns (string memory)',
  'function symbol() public view returns (string memory)',
  'function totalSupply() public view returns (uint256)',
  'function balanceOf(address account) public view returns (uint256)',
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) public returns (bool)'
];

// Token Factory contract address on Base
const TOKEN_FACTORY_ADDRESS = process.env.TOKEN_FACTORY_ADDRESS || '';

export const deployToken = async (
  provider: Web3Provider,
  name: string,
  symbol: string,
  initialSupply: string,
  recipientAddress: string
): Promise<string> => {
  try {
    console.log('Starting token deployment with parameters:', {
      name,
      symbol,
      initialSupply,
      recipientAddress
    });

    const signer = provider.getSigner();
    const factory = new ethers.Contract(TOKEN_FACTORY_ADDRESS, TOKEN_FACTORY_ABI, signer);

    // Validate inputs
    if (!name || !symbol || !initialSupply || !recipientAddress) {
      throw new Error('All parameters are required');
    }

    if (!ethers.utils.isAddress(recipientAddress)) {
      throw new Error('Invalid recipient address');
    }

    // Convert initial supply to wei
    const initialSupplyWei = ethers.utils.parseUnits(initialSupply, 18);
    console.log('Initial supply in wei:', initialSupplyWei.toString());

    // Estimate gas before sending transaction
    try {
      const gasEstimate = await factory.estimateGas.createToken(
        name,
        symbol,
        initialSupplyWei,
        recipientAddress
      );
      console.log('Estimated gas:', gasEstimate.toString());
    } catch (error) {
      console.error('Gas estimation failed:', error);
      throw new Error(`Gas estimation failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Send transaction
    console.log('Sending createToken transaction...');
    const tx = await factory.createToken(
      name,
      symbol,
      initialSupplyWei,
      recipientAddress
    );
    console.log('Transaction sent:', tx.hash);

    // Wait for transaction to be mined
    console.log('Waiting for transaction to be mined...');
    const receipt = await tx.wait();
    console.log('Transaction mined:', receipt);

    // Get the token address from the transaction receipt
    const tokenAddress = receipt.logs[0].address;
    console.log('Token deployed at:', tokenAddress);

    // Store the token address in localStorage
    const deployedTokens = JSON.parse(localStorage.getItem('deployedTokens') || '[]');
    deployedTokens.push({
      address: tokenAddress,
      name,
      symbol,
      timestamp: Date.now()
    });
    localStorage.setItem('deployedTokens', JSON.stringify(deployedTokens));

    return tokenAddress;
  } catch (error) {
    console.error('Error in deployToken:', error);
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds to deploy token. Please ensure you have enough ETH for gas.');
      } else if (error.message.includes('user rejected')) {
        throw new Error('Transaction was rejected by user.');
      } else if (error.message.includes('gas required exceeds allowance')) {
        throw new Error('Gas limit too low. Please try again.');
      }
    }
    throw new Error(`Failed to deploy token: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getTokenInfo = async (
  provider: Web3Provider,
  tokenAddress: string
): Promise<{ name: string; symbol: string; totalSupply: string }> => {
  try {
    console.log('Fetching token info for:', tokenAddress);
    const factory = new ethers.Contract(TOKEN_FACTORY_ADDRESS, TOKEN_FACTORY_ABI, provider);
    const [name, symbol, totalSupply] = await factory.getTokenInfo(tokenAddress);
    console.log('Token info:', { name, symbol, totalSupply: totalSupply.toString() });
    return {
      name,
      symbol,
      totalSupply: ethers.utils.formatUnits(totalSupply, 18),
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    throw new Error(`Failed to fetch token info: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Add a new function to get deployed tokens
export const getDeployedTokens = (): string[] => {
  try {
    const deployedTokens = JSON.parse(localStorage.getItem('deployedTokens') || '[]');
    return deployedTokens.map((token: any) => token.address);
  } catch (error) {
    console.error('Error getting deployed tokens:', error);
    return [];
  }
}; 