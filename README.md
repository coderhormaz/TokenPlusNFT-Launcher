# Base NFT Creator

A decentralized application (DApp) for creating and minting NFTs on the Base blockchain. This application provides a full-featured drawing board with various tools and the ability to mint your creations as NFTs.

## Features

- Connect your Web3 wallet (MetaMask)
- Full-featured drawing board with:
  - Pen and eraser tools
  - Color picker
  - Line width adjustment
  - Undo/Redo functionality
  - Image upload and manipulation
- Mint your creations as NFTs on Base
- View your NFT collection

## Prerequisites

- Node.js (v14 or higher)
- MetaMask wallet with Base network configured
- Some ETH on Base for gas fees

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd base-nft-creator
```

2. Install dependencies:
```bash
npm install
```

3. Configure Base network in MetaMask:
   - Network Name: Base
   - RPC URL: https://mainnet.base.org
   - Chain ID: 8453
   - Currency Symbol: ETH
   - Block Explorer URL: https://basescan.org

## Development

1. Start the development server:
```bash
npm start
```

2. The application will be available at `http://localhost:3000`

## Smart Contract Deployment

1. Create a `.env` file in the root directory with your private key:
```
PRIVATE_KEY=your_private_key_here
```

2. Deploy the smart contract:
```bash
npx hardhat run scripts/deploy.js --network base
```

3. Update the contract address in `src/config.ts` with the deployed contract address.

## Usage

1. Connect your MetaMask wallet
2. Click "Let's Start" to open the drawing board
3. Use the drawing tools to create your artwork
4. Upload images if desired
5. Click "Mint NFT" to mint your creation
6. View your NFTs in the "My Collection" page

## Technologies Used

- React
- TypeScript
- Chakra UI
- ethers.js
- Web3-React
- Solidity
- Hardhat

## License

MIT 