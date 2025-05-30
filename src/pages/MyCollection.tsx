import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  useToast,
  Spinner,
  Center,
  useColorMode,
  Image,
  Link,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { getOwnedNFTs, getTokenURI } from '../utils/contract';
import { CONTRACT_ADDRESS as NFT_CONTRACT_ADDRESS } from '../config';

interface NFT {
  tokenId: number;
  imageUrl: string;
  name: string;
  description: string;
  contractAddress: string;
}

const LoadingSkeleton = () => {
  const { colorMode } = useColorMode();
  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
      {[1, 2, 3, 4].map((i) => (
        <Box
          key={i}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={6}
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
          borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
          shadow="md"
        >
          <Skeleton height="250px" borderRadius="md" mb={6} />
          <VStack spacing={3} align="start" w="full">
            <Box w="full">
              <Skeleton height="24px" width="60%" mb={2} />
              <Skeleton height="20px" width="80%" />
            </Box>
            <Box w="full">
              <Skeleton height="20px" width="40%" />
            </Box>
          </VStack>
        </Box>
      ))}
    </Grid>
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
      toast({
        title: 'Please connect your wallet',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      setLoadingNFTs(false);
      return;
    }

    const fetchNFTs = async () => {
      try {
        setLoadingNFTs(true);
        console.log('Fetching NFTs for account:', account);

        const tokenIds = await getOwnedNFTs(provider, account);
        console.log('Found token IDs:', tokenIds);

        if (tokenIds.length === 0) {
          console.log('No NFTs found for this account');
          setNfts([]);
          setLoadingNFTs(false);
          setFetchingNFTMetadata(false);
          return;
        }

        setFetchingNFTMetadata(true);
        const nftPromises = tokenIds.map(async (tokenId) => {
          try {
            console.log(`Fetching metadata for token ${tokenId}`);
            const tokenURI = await getTokenURI(provider, tokenId);
            console.log(`Token ${tokenId} URI:`, tokenURI);

            let metadata;
            if (tokenURI.startsWith('data:')) {
              const base64Data = tokenURI.split(',')[1];
              metadata = JSON.parse(atob(base64Data));
            } else {
              const response = await fetch(tokenURI);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${tokenURI}`);
              }
              metadata = await response.json();
            }

            console.log(`Token ${tokenId} metadata:`, metadata);

            return {
              tokenId,
              imageUrl: metadata.image || '',
              name: metadata.name || `NFT #${tokenId}`,
              description: metadata.description || 'No description available',
              contractAddress: NFT_CONTRACT_ADDRESS,
            } as NFT;
          } catch (error) {
            console.error(`Error processing token ${tokenId}:`, error);
            return {
              tokenId,
              imageUrl: '',
              name: `NFT #${tokenId} (Error)`,
              description: 'Error loading metadata',
              contractAddress: NFT_CONTRACT_ADDRESS,
            } as NFT;
          }
        });

        const nftData = await Promise.all(nftPromises);
        console.log('Processed NFT data:', nftData);
        setNfts(nftData.filter(nft => nft.imageUrl));

      } catch (error) {
        console.error('Error fetching NFTs:', error);
        toast({
          title: 'Error fetching NFTs',
          description: error instanceof Error ? error.message : 'Please try again',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoadingNFTs(false);
        setFetchingNFTMetadata(false);
      }
    };

    fetchNFTs();
  }, [account, isActive, provider, toast]);

  if (!isActive) {
    return (
      <Container maxW="container.md" py={24} centerContent>
        <Box
          w="100%"
          p={{ base: 6, md: 10 }}
          borderRadius="2xl"
          boxShadow="2xl"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          borderWidth={1}
          borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
          textAlign="center"
        >
          <VStack spacing={4}>
            <Heading size="xl">My Collection</Heading>
            <Text fontSize="lg">Please connect your wallet to view your NFTs.</Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  const isLoading = loadingNFTs || fetchingNFTMetadata;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center" size="xl">My NFT Collection</Heading>
        <Text textAlign="center" fontSize="lg" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
          View the NFTs you own on the Base blockchain.
        </Text>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <Box>
            {nfts.length === 0 ? (
              <Text textAlign="center">No NFTs found in your collection.</Text>
            ) : (
              <Grid
                templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                gap={6}
              >
                {nfts.map((nft) => (
                  <Box
                    key={`${nft.contractAddress}-${nft.tokenId}`}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    p={6}
                    bg={colorMode === 'dark' ? 'gray.700' : 'white'}
                    borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                    shadow="md"
                    _hover={{
                      transform: 'translateY(-2px)',
                      shadow: 'lg',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {nft.imageUrl && (
                      <Image
                        src={nft.imageUrl}
                        alt={nft.name}
                        borderRadius="md"
                        objectFit="cover"
                        boxSize="250px"
                        mx="auto"
                        mb={6}
                        shadow="md"
                      />
                    )}
                    <VStack spacing={3} align="start" w="full">
                      <Box w="full">
                        <Text fontWeight="bold" fontSize="lg" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
                          Name: {nft.name}
                        </Text>
                      </Box>
                      <Box w="full">
                        <Text fontSize="md" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
                          Description: {nft.description}
                        </Text>
                      </Box>
                      <Link
                        href={`https://basescan.org/nft/${nft.contractAddress}/${nft.tokenId}`}
                        isExternal
                        color="blue.500"
                        fontWeight="medium"
                        _hover={{
                          color: 'blue.600',
                          transform: 'translateX(2px)',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        View on Blockchain Explorer
                      </Link>
                    </VStack>
                  </Box>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default MyCollection; 