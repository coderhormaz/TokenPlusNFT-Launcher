import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../config';

const ABI = [
  // ERC721 functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  // Custom mint function
  "function mint(address recipient, string memory _tokenURI) returns (uint256)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export const getContract = (provider: ethers.providers.Web3Provider) => {
  try {
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  } catch (error) {
    console.error('Error getting contract:', error);
    throw new Error('Failed to initialize contract');
  }
};

export const getTokenURI = async (
  provider: ethers.providers.Web3Provider,
  tokenId: number
): Promise<string> => {
  try {
    const contract = getContract(provider);
    const uri = await contract.tokenURI(tokenId);
    if (!uri) throw new Error('Token URI not found');
    return uri;
  } catch (error) {
    console.error(`Error getting token URI for token ${tokenId}:`, error);
    throw new Error(`Failed to get token URI for token ${tokenId}`);
  }
};

export const getOwnedNFTs = async (
  provider: ethers.providers.Web3Provider,
  owner: string
): Promise<number[]> => {
  try {
    const contract = getContract(provider);
    
    // First check if the contract is deployed
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === '0x') {
      throw new Error('Contract is not deployed at the specified address');
    }

    // Get contract info for debugging
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      console.log(`Contract info - Name: ${name}, Symbol: ${symbol}`);
    } catch (error) {
      console.warn('Could not get contract name/symbol:', error);
    }

    // Get balance
    const balance = await contract.balanceOf(owner);
    console.log(`Found ${balance.toString()} NFTs for address ${owner}`);
    
    if (balance.toNumber() === 0) {
      return [];
    }

    // Get all Transfer events where the owner is the recipient
    const filter = contract.filters.Transfer(null, owner);
    const events = await contract.queryFilter(filter);
    
    // Get unique token IDs from events
    const tokenIds = new Set<number>();
    for (const event of events) {
      if (event.args) {
        const tokenId = event.args[2].toNumber();
        // Verify the current owner is still the same
        try {
          const currentOwner = await contract.ownerOf(tokenId);
          if (currentOwner.toLowerCase() === owner.toLowerCase()) {
            tokenIds.add(tokenId);
          }
        } catch (error) {
          console.warn(`Could not verify ownership of token ${tokenId}:`, error);
        }
      }
    }

    console.log(`Found ${tokenIds.size} unique tokens owned by ${owner}`);
    return Array.from(tokenIds);
  } catch (error) {
    console.error('Error getting owned NFTs:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch owned NFTs: ${error.message}`);
    }
    throw new Error('Failed to fetch owned NFTs');
  }
};

export const mintNFT = async (
  provider: ethers.providers.Web3Provider,
  recipient: string,
  tokenURI: string
): Promise<number | undefined> => {
  try {
    const contract = getContract(provider);
    const tx = await contract.mint(recipient, tokenURI);
    const receipt = await tx.wait();

    // Get the token ID from the Transfer event
    const event = receipt.events?.find((e: any) => e.event === 'Transfer');
    const tokenId = event?.args?.tokenId ?? event?.args?.[2];
    return tokenId ? tokenId.toNumber() : undefined;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw new Error('Failed to mint NFT');
  }
}; 