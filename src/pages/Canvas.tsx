import React, { useRef, useState, useEffect, useRef as useRefHook } from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Tooltip,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useColorMode,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  Container,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { mintNFT } from '../utils/contract';
import { isBaseChain, BASE_CHAIN_ID } from '../utils/chain';
import { NFTStorage, File as NFTFile } from 'nft.storage';
import lighthouse from '@lighthouse-web3/sdk';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Point {
  x: number;
  y: number;
}

interface HistoryItem {
  imageData: ImageData;
  type: 'draw' | 'image';
}

// Add type definitions for event handlers
interface ChangeEvent<T = Element> {
  target: EventTarget & T;
}

interface EventTarget {
  value: string;
}

interface MouseEvent<T = Element> {
  clientX: number;
  clientY: number;
}

// Add type definitions for Chakra UI components
declare module '@chakra-ui/react' {
  export interface ButtonProps {
    as?: React.ElementType;
    htmlFor?: string;
  }
}

const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN || '';
const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY || '';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(2);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { account, active: isActive, library: provider } = useWeb3React<Web3Provider>();
  const toast = useToast();
  const [isMinting, setIsMinting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const walletToastShown = useRefHook(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if ((!isActive || !account || !provider) && !walletToastShown.current) {
      toast({
        title: 'Please connect your wallet',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      walletToastShown.current = true;
    }
    if (account && provider) {
      walletToastShown.current = false;
    }
  }, [account, isActive, provider, toast]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ imageData, type: 'draw' });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let x, y;
    if ('touches' in e) {
      // Touch event
      x = (e.touches[0].clientX - rect.left) * scaleX;
      y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
      // Mouse event
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? backgroundColor : color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let x, y;
    if ('touches' in e) {
      // Touch event
      x = (e.touches[0].clientX - rect.left) * scaleX;
      y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
      // Mouse event
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveToHistory();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.putImageData(history[historyIndex - 1].imageData, 0, 0);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.putImageData(history[historyIndex + 1].imageData, 0, 0);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const ratio = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const centerX = (canvas.width - img.width * ratio) / 2;
        const centerY = (canvas.height - img.height * ratio) / 2;
        ctx.drawImage(
          img,
          centerX,
          centerY,
          img.width * ratio,
          img.height * ratio
        );
        saveToHistory();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Helper to get chainId
  const getChainId = () => {
    if (provider?.provider) {
      const chainId = (provider.provider as any).chainId;
      if (chainId) return chainId;
    }
    if (window.ethereum?.chainId) {
      return window.ethereum.chainId;
    }
    return undefined;
  };

  // Helper to switch to Base
  const switchToBase = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // 8453 in hex
        });
      } catch (switchError: any) {
        // If the chain is not added, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x2105',
                  chainName: 'Base',
                  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                  rpcUrls: [process.env.RPC_URL || ''],
                  blockExplorerUrls: [process.env.BLOCK_EXPLORER_URL || ''],
                },
              ],
            });
          } catch (addError) {
            // ignore
          }
        }
      }
    }
  };

  const handleMint = async () => {
    if (!isActive || !account || !provider) {
      toast({
        title: 'Please connect your wallet',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const chainId = getChainId();
    if (!isBaseChain(chainId)) {
      toast({
        title: 'Wrong Network',
        description: (
          <span>
            Please switch to the Base network. <br />
            <Button size="xs" colorScheme="blue" mt={2} onClick={switchToBase}>
              Switch to Base
            </Button>
          </span>
        ),
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    setIsModalOpen(true);
  };

  // Helper: Upload a Blob as a File to Lighthouse
  async function uploadToLighthouse(blob: Blob, filename: string, mimeType: string): Promise<string> {
    // Convert Blob to File
    const file = new File([blob], filename, { type: mimeType });
    // Lighthouse expects an array of File(s)
    const response = await lighthouse.upload([file], LIGHTHOUSE_API_KEY);
    return `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
  }

  const handleMintSubmit = async () => {
    if (!isActive || !account || !provider || !nftName || !nftDescription) {
      toast({
        title: 'Please fill in all fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      setIsMinting(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (!blob) throw new Error('Failed to get image blob');

      // Upload image to Lighthouse (must be File[])
      const imageUrl = await uploadToLighthouse(blob, 'nft-image.png', 'image/png');

      // Create metadata
      const metadata = {
        name: nftName,
        description: nftDescription,
        image: imageUrl,
      };
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });

      // Upload metadata to Lighthouse (must be File[])
      const metadataUrl = await uploadToLighthouse(metadataBlob, 'metadata.json', 'application/json');

      console.log('NFT Image URL:', imageUrl);
      console.log('NFT Metadata URL:', metadataUrl);

      // Extra: Check network and contract before minting
      const network = await provider.getNetwork();
      if (network.chainId !== 8453) {
        toast({
          title: 'Wrong Network',
          description: 'Please switch to Base Mainnet in MetaMask.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
        setIsMinting(false);
        return;
      }
      if (!account) {
        toast({
          title: 'Wallet Not Connected',
          description: 'Please connect your wallet.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
        setIsMinting(false);
        return;
      }

      // Mint NFT with Lighthouse metadata URL
      let tokenId;
      try {
        tokenId = await mintNFT(provider, account, metadataUrl);
      } catch (err) {
        // Handle contract/network errors
        toast({
          title: 'Blockchain Error',
          description: 'Check your network, contract address, and wallet connection.\n' + ((err as any)?.message || ''),
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
        setIsMinting(false);
        return;
      }

      toast({
        title: 'NFT Minted Successfully!',
        description: tokenId !== undefined ? `Token ID: ${tokenId}` : 'Token minted, but token ID could not be determined.',
        status: 'success',
        duration: 10000, // 10 seconds
        isClosable: true,
      });
      setIsModalOpen(false);
      setNftName('');
      setNftDescription('');
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: 'Error minting NFT',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsMinting(false);
    }
  };

  // Add this new function to handle background color change
  const handleBackgroundColorChange = (newColor: string) => {
    setBackgroundColor(newColor);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save the current drawing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Fill with new background color
    ctx.fillStyle = newColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Restore the drawing
    ctx.putImageData(imageData, 0, 0);
    
    saveToHistory();
  };

  return (
    <Box style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <Box
        p={{ base: '1rem', md: '2rem' }}
        borderRadius="1rem"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        bg={colorMode === 'dark' ? '#2D3748' : 'white'}
        border={`1px solid ${colorMode === 'dark' ? '#4A5568' : '#E2E8F0'}`}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap="1rem" 
          marginBottom="1rem" 
          flexWrap="wrap" 
          alignItems={{ base: 'center', md: 'center' }}
          justifyContent={{ base: 'center', md: 'space-between' }}
        >
          <Flex 
            direction={{ base: 'row', md: 'row' }}
            gap="1rem" 
            flexWrap="wrap" 
            alignItems="center"
            width={{ base: '100%', md: 'auto' }}
            justifyContent={{ base: 'center', md: 'flex-start' }}
          >
            <VStack spacing={1} align="center">
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Background</Text>
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                style={{ width: '60px', height: '40px', padding: '2px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
              />
            </VStack>

            <VStack spacing={1} align="center">
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Eraser</Text>
              <IconButton
                aria-label="Eraser tool"
                onClick={() => setTool('eraser')}
                style={{
                  backgroundColor: tool === 'eraser' ? '#3182CE' : '#E2E8F0',
                  color: tool === 'eraser' ? 'white' : 'black',
                }}
              >
                <span>🧹</span>
              </IconButton>
            </VStack>

            <VStack spacing={1} align="center">
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Pen</Text>
              <IconButton
                aria-label="Pen tool"
                onClick={() => setTool('pen')}
                style={{
                  backgroundColor: tool === 'pen' ? '#3182CE' : '#E2E8F0',
                  color: tool === 'pen' ? 'white' : 'black',
                }}
              >
                <span>✏️</span>
              </IconButton>
            </VStack>

            <VStack spacing={1} align="center">
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Pen Color</Text>
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: '60px', height: '40px', padding: '2px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
              />
            </VStack>
          </Flex>

          <FormControl width={{ base: '100%', md: '200px' }}>
            <FormLabel fontSize="sm" fontWeight="medium" mb={2}>Brush Size</FormLabel>
            <Slider
              value={lineWidth}
              onChange={setLineWidth}
              min={1}
              max={50}
              step={1}
            >
              <SliderTrack 
                h="2px" 
                bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
              >
                <SliderFilledTrack bg={color} />
              </SliderTrack>
              <SliderThumb
                boxSize="12px"
                bg={color}
                border="1px solid"
                borderColor={colorMode === 'dark' ? 'white' : 'gray.800'}
              />
            </Slider>
            <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'} mt={1}>
              {lineWidth}px
            </Text>
          </FormControl>

          <Flex 
            direction={{ base: 'row', md: 'row' }}
            gap="1rem" 
            flexWrap="wrap" 
            alignItems="center"
            width={{ base: '100%', md: 'auto' }}
            justifyContent={{ base: 'center', md: 'flex-start' }}
          >
            <VStack spacing={1} align="center">
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Undo</Text>
              <Button
                onClick={undo}
                disabled={historyIndex <= 0}
                style={{
                  backgroundColor: '#E2E8F0',
                  color: 'black',
                  border: '1px solid #CBD5E0',
                  fontWeight: 'bold',
                }}
              >
                Undo
              </Button>
            </VStack>

            <VStack spacing={1} align="center">
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Redo</Text>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                style={{
                  backgroundColor: '#E2E8F0',
                  color: 'black',
                  border: '1px solid #CBD5E0',
                  fontWeight: 'bold',
                }}
              >
                Redo
              </Button>
            </VStack>

            <VStack spacing={1} align="center">
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Clear</Text>
              <Button
                onClick={clearCanvas}
                style={{
                  backgroundColor: '#FC8181',
                  color: 'white',
                  border: '1px solid #F56565',
                  fontWeight: 'bold',
                }}
              >
                Clear
              </Button>
            </VStack>

            <VStack spacing={1} align="center">
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Upload</Text>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <Button
                as="label"
                htmlFor="image-upload"
                style={{
                  backgroundColor: '#9F7AEA',
                  color: 'white',
                  border: '1px solid #805AD5',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Upload Image
              </Button>
            </VStack>

            <VStack spacing={1} align="center">
              <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Mint</Text>
              <Button
                onClick={handleMint}
                disabled={isMinting}
                style={{
                  backgroundColor: '#48BB78',
                  color: 'white',
                  border: '1px solid #38A169',
                  fontWeight: 'bold',
                  padding: '0 1.5rem',
                }}
              >
                {isMinting ? 'Minting...' : 'Mint NFT'}
              </Button>
            </VStack>
          </Flex>
        </Flex>

        <Box
          border={`2px solid ${colorMode === 'dark' ? '#4A5568' : '#E2E8F0'}`}
          borderRadius="0.75rem"
          overflow="hidden"
          bg="white"
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH={{ base: 'auto', md: '400px' }}
          marginBottom="1rem"
          p={0}
          w={{ base: '100%', md: '75%', lg: '640px' }}
          maxW={{ base: '100%', md: '75%', lg: '640px' }}
          mx="auto"
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ 
              cursor: 'crosshair', 
              background: backgroundColor,
              width: '100%',
              height: '100%',
              touchAction: 'none',
              padding: 0,
              margin: 0
            }}
          />
        </Box>
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint Your NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ paddingBottom: '1.5rem' }}>
            <FormControl>
              <FormLabel>NFT Name</FormLabel>
              <Input
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                placeholder="Enter NFT name"
              />
            </FormControl>
            <FormControl style={{ marginTop: '1rem' }}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
                placeholder="Enter NFT description"
              />
            </FormControl>
            <Button
              onClick={handleMintSubmit}
              disabled={isMinting}
              style={{
                backgroundColor: '#3182CE',
                color: 'white',
                marginRight: '0.75rem',
                marginTop: '1rem',
                fontWeight: 'bold',
              }}
            >
              {isMinting ? 'Minting...' : 'Mint'}
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
              style={{
                backgroundColor: 'transparent',
                color: 'gray.600',
              }}
            >
              Cancel
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Canvas; 