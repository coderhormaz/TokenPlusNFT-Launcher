import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
  useToast,
  useColorMode,
  Image,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { mintNFT } from '../utils/contract';

const CreateNFT: React.FC = () => {
  const navigate = useNavigate();
  const { account, active: isActive, library: provider } = useWeb3React<Web3Provider>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActive || !account || !provider) {
      toast({
        title: 'Please connect your wallet',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!name || !description || !imageUrl) {
      toast({
        title: 'Please fill in all fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      // Create metadata object
      const metadata = {
        name,
        description,
        image: imageUrl
      };
      
      // Convert metadata to base64
      const metadataString = JSON.stringify(metadata);
      const base64Metadata = btoa(metadataString);
      const tokenURI = `data:application/json;base64,${base64Metadata}`;
      
      const tokenId = await mintNFT(provider, account, tokenURI);
      toast({
        title: 'NFT Minted Successfully!',
        description: `Your NFT has been minted with Token ID: ${tokenId}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/my-collection');
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: 'Error Minting NFT',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <Heading>Create NFT</Heading>
            <Text>Please connect your wallet to create an NFT</Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8} bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Create Your NFT</Heading>
        <Box
          as="form"
          onSubmit={handleSubmit}
          p={8}
          borderRadius="2xl"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          borderWidth={1}
          borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
          shadow="lg"
        >
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel color={colorMode === 'dark' ? 'white' : 'gray.700'}>NFT Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for your NFT"
                bg={colorMode === 'dark' ? 'gray.700' : 'white'}
                borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                color={colorMode === 'dark' ? 'white' : 'gray.800'}
                _hover={{ borderColor: 'blue.400' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={colorMode === 'dark' ? 'white' : 'gray.700'}>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your NFT"
                rows={4}
                bg={colorMode === 'dark' ? 'gray.700' : 'white'}
                borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                color={colorMode === 'dark' ? 'white' : 'gray.800'}
                _hover={{ borderColor: 'blue.400' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={colorMode === 'dark' ? 'white' : 'gray.700'}>Image URL</FormLabel>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter the URL of your image"
                bg={colorMode === 'dark' ? 'gray.700' : 'white'}
                borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                color={colorMode === 'dark' ? 'white' : 'gray.800'}
                _hover={{ borderColor: 'blue.400' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
              />
            </FormControl>

            {imageUrl && (
              <Box 
                w="100%" 
                p={4} 
                borderRadius="lg" 
                bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
                borderWidth={1}
                borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
              >
                <Center>
                  <Image
                    src={imageUrl}
                    alt="NFT Preview"
                    maxH="200px"
                    borderRadius="md"
                    fallbackSrc="https://via.placeholder.com/200"
                  />
                </Center>
              </Box>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="100%"
              isLoading={isLoading}
              loadingText="Minting..."
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              Mint NFT
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreateNFT; 