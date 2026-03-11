import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  useToast,
  useColorMode,
  Image,
  Link,
  Skeleton,
  Badge,
  Button,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { getOwnedNFTs, getTokenURI } from '../utils/contract';
import { CONTRACT_ADDRESS as NFT_CONTRACT_ADDRESS } from '../config';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface NFT {
  tokenId: number;
  imageUrl: string;
  name: string;
  description: string;
  contractAddress: string;
}

const NFTCardSkeleton = () => {
  const { colorMode } = useColorMode();
  return (
    <Box
      borderRadius="20px"
      overflow="hidden"
      border="1px solid"
      borderColor={colorMode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}
      bg={colorMode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)'}
    >
      <Skeleton height="240px" startColor={colorMode === 'dark' ? 'gray.800' : 'gray.100'} endColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'} />
      <Box p={5}>
        <Skeleton height="18px" width="60%" mb={3} />
        <Skeleton height="14px" width="85%" mb={2} />
        <Skeleton height="14px" width="40%" />
      </Box>
    </Box>
  );
};

const NFTCard = ({ nft }: { nft: NFT }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      borderRadius="20px"
      overflow="hidden"
      border="1px solid"
      borderColor={colorMode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}
      bg={colorMode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)'}
      backdropFilter="blur(20px)"
      transition="all 0.3s cubic-bezier(0.4,0,0.2,1)"
      _hover={{
        borderColor: colorMode === 'dark' ? 'rgba(139,92,246,0.35)' : 'rgba(99,102,241,0.25)',
        shadow: colorMode === 'dark' ? '0 12px 40px rgba(139,92,246,0.15)' : '0 8px 32px rgba(99,102,241,0.12)',
        transform: 'translateY(-6px)',
      }}
    >
      <Box position="relative" overflow="hidden" bg={colorMode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)'}>
        {nft.imageUrl ? (
          <Image
            src={nft.imageUrl}
            alt={nft.name}
            w="100%"
            h="240px"
            objectFit="cover"
            transition="transform 0.4s ease"
            _groupHover={{ transform: 'scale(1.04)' }}
          />
        ) : (
          <Box h="240px" display="flex" alignItems="center" justifyContent="center" fontSize="48px">🖼️</Box>
        )}
        <Box
          position="absolute"
          top={3}
          right={3}
        >
          <Badge
            px={2.5} py={1}
            borderRadius="8px"
            bg="rgba(0,0,0,0.55)"
            backdropFilter="blur(8px)"
            color="white"
            fontSize="xs"
            fontWeight="600"
            border="1px solid rgba(255,255,255,0.12)"
          >
            #{nft.tokenId}
          </Badge>
        </Box>
      </Box>
      <Box p={5}>
        <Text fontWeight="700" fontSize="md" color={colorMode === 'dark' ? 'white' : 'gray.900'} mb={1} noOfLines={1}>
          {nft.name}
        </Text>
        <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.500'} mb={4} noOfLines={2} lineHeight="1.6">
          {nft.description}
        </Text>
        <Link
          href={`https://sepolia.etherscan.io/nft/${nft.contractAddress}/${nft.tokenId}`}
          isExternal
          fontSize="xs"
          fontWeight="600"
          color={colorMode === 'dark' ? 'brand.400' : 'brand.600'}
          display="inline-flex"
          alignItems="center"
          gap={1}
          _hover={{ color: colorMode === 'dark' ? 'brand.300' : 'brand.700', gap: 1.5 }}
          transition="all 0.2s"
        >
          View on Etherscan <ExternalLinkIcon boxSize={3} />
        </Link>
      </Box>
    </Box>
  );
};

const MyCollection: React.FC = () => {
  const { account, active: isActive, library: provider } = useWeb3React<Web3Provider>();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(true);
  const [fetchingNFTMetadata, setFetchingNFTMetadata] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!isActive || !account || !provider) {
      toast({ title: 'Please connect your wallet', status: 'warning', duration: 3000, isClosable: true });
      setLoadingNFTs(false);
      return;
    }
    const fetchNFTs = async () => {
      try {
        setLoadingNFTs(true);
        const tokenIds = await getOwnedNFTs(provider, account);
        if (tokenIds.length === 0) { setNfts([]); setLoadingNFTs(false); setFetchingNFTMetadata(false); return; }
        setFetchingNFTMetadata(true);
        const nftPromises = tokenIds.map(async (tokenId) => {
          try {
            const tokenURI = await getTokenURI(provider, tokenId);
            let metadata;
            if (tokenURI.startsWith('data:')) {
              metadata = JSON.parse(atob(tokenURI.split(',')[1]));
            } else {
              const response = await fetch(tokenURI);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              metadata = await response.json();
            }
            return { tokenId, imageUrl: metadata.image || '', name: metadata.name || `NFT #${tokenId}`, description: metadata.description || 'No description available', contractAddress: NFT_CONTRACT_ADDRESS } as NFT;
          } catch {
            return { tokenId, imageUrl: '', name: `NFT #${tokenId}`, description: 'Error loading metadata', contractAddress: NFT_CONTRACT_ADDRESS } as NFT;
          }
        });
        const nftData = await Promise.all(nftPromises);
        setNfts(nftData.filter(nft => nft.imageUrl));
      } catch (error) {
        toast({ title: 'Error fetching NFTs', description: error instanceof Error ? error.message : 'Please try again', status: 'error', duration: 5000, isClosable: true });
      } finally {
        setLoadingNFTs(false);
        setFetchingNFTMetadata(false);
      }
    };
    fetchNFTs();
  }, [account, isActive, provider, toast]);

  const cardBg = colorMode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)';
  const cardBorder = colorMode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const isLoading = loadingNFTs || fetchingNFTMetadata;

  if (!isActive) {
    return (
      <Container maxW="480px" py={24} centerContent>
        <Box w="100%" p={10} borderRadius="24px" bg={cardBg} backdropFilter="blur(20px)" border="1px solid" borderColor={cardBorder} textAlign="center">
          <VStack spacing={4}>
            <Box fontSize="48px">🔒</Box>
            <Heading size="md">Connect your wallet</Heading>
            <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>Connect MetaMask to view your NFT collection.</Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      <Box
        position="fixed" top="20%" right="-100px"
        w="400px" h="400px" borderRadius="50%"
        bg={colorMode === 'dark' ? 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)'}
        pointerEvents="none" zIndex={0}
      />
      <Container maxW="1100px" py={{ base: 10, md: 16 }} position="relative" zIndex={1}>
        <VStack spacing={10} align="stretch">

          {/* Header */}
          <VStack spacing={3} textAlign="center">
            <Badge
              px={3} py={1}
              borderRadius="full"
              bg={colorMode === 'dark' ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'}
              border="1px solid"
              borderColor={colorMode === 'dark' ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'}
              color={colorMode === 'dark' ? '#a5b4fc' : '#4f46e5'}
              fontSize="xs"
              fontWeight="600"
              letterSpacing="0.08em"
              textTransform="uppercase"
            >
              Your NFTs
            </Badge>
            <Heading size="xl" letterSpacing="-0.03em">My Collection</Heading>
            <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>
              NFTs you own on Ethereum Sepolia
            </Text>
            {account && (
              <Box
                px={4} py={2}
                borderRadius="10px"
                bg={colorMode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                border="1px solid"
                borderColor={cardBorder}
                display="inline-block"
              >
                <Text fontFamily="mono" fontSize="xs" color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>
                  {account.slice(0, 10)}...{account.slice(-8)}
                </Text>
              </Box>
            )}
          </VStack>

          {/* Grid */}
          {isLoading ? (
            <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
              {[1, 2, 3, 4].map(i => <NFTCardSkeleton key={i} />)}
            </Grid>
          ) : nfts.length === 0 ? (
            <Box
              p={16}
              borderRadius="24px"
              bg={cardBg}
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor={cardBorder}
              textAlign="center"
            >
              <VStack spacing={4}>
                <Box fontSize="56px">🎨</Box>
                <Heading size="md">No NFTs yet</Heading>
                <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.500'} fontSize="sm" maxW="320px">
                  You haven't minted any NFTs yet. Start creating on the canvas!
                </Text>
                <Button
                  as="a"
                  href="/canvas"
                  size="md"
                  px={6}
                  borderRadius="12px"
                  bg="linear-gradient(135deg, #6366f1, #8b5cf6)"
                  color="white"
                  fontWeight="600"
                  border="1px solid rgba(139,92,246,0.3)"
                  _hover={{
                    bg: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    shadow: '0 6px 20px rgba(99,102,241,0.4)',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                  mt={2}
                >
                  Create Your First NFT
                </Button>
              </VStack>
            </Box>
          ) : (
            <>
              <HStack justify="space-between" align="center">
                <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>
                  {nfts.length} NFT{nfts.length !== 1 ? 's' : ''} found
                </Text>
              </HStack>
              <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
                {nfts.map(nft => (
                  <NFTCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} />
                ))}
              </Grid>
            </>
          )}

        </VStack>
      </Container>
    </Box>
  );
};

export default MyCollection;
