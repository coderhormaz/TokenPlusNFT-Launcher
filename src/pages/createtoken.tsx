import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  useColorMode,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Link,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { deployToken } from '../utils/token';

const CreateToken: React.FC = () => {
  const navigate = useNavigate();
  const { account, active: isActive, library: provider } = useWeb3React<Web3Provider>();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('1000000');
  const [recipientAddress, setRecipientAddress] = useState('');
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

    if (!name || !symbol || !initialSupply || !recipientAddress) {
      toast({
        title: 'Please fill in all fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!ethers.utils.isAddress(recipientAddress)) {
      toast({
        title: 'Invalid Recipient Address',
        description: 'Please enter a valid Ethereum address.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);

      // Deploy token using the factory contract
      const tokenAddress = await deployToken(
        provider,
        name,
        symbol,
        initialSupply,
        recipientAddress
      );

      toast({
        title: 'Token Created Successfully!',
        description: (
          <Box>
            <Text mb={2} color={colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800'}>Your token has been deployed!</Text>
            <Text color={colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800'}>
              View on Base Explorer:{' '}
              <Link
                href={`https://basescan.org/token/${tokenAddress}`}
                isExternal
                color="blue.500"
                _hover={{
                  color: 'blue.600',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {tokenAddress}
              </Link>
            </Text>
          </Box>
        ),
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      // Reset form
      setName('');
      setSymbol('');
      setInitialSupply('1000000');
      setRecipientAddress('');
    } catch (error) {
      console.error('Error creating token:', error);
      toast({
        title: 'Error Creating Token',
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 7000,
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
            <Heading size="xl">Create Token</Heading>
            <Text fontSize="lg">Please connect your wallet to create a token.</Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading 
          textAlign="center" 
          size="xl"
          color={colorMode === 'dark' ? 'white' : 'gray.800'}
        >
          Create Your Token
        </Heading>
        <Text 
          textAlign="center" 
          fontSize="lg" 
          color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
        >
          Deploy your own ERC20 token on the Base blockchain using the Token Factory.
        </Text>

        <Box
          as="form"
          onSubmit={handleSubmit}
          p={8}
          borderRadius="2xl"
          boxShadow="xl"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          borderWidth={1}
          borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
        >
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>Token Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My Awesome Token"
                _placeholder={{ color: colorMode === 'dark' ? 'gray.500' : 'gray.400' }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>Token Symbol</FormLabel>
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g., MAT"
                maxLength={5}
                _placeholder={{ color: colorMode === 'dark' ? 'gray.500' : 'gray.400' }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>Initial Supply</FormLabel>
              <NumberInput
                value={initialSupply}
                onChange={(value) => setInitialSupply(value)}
                min={1}
                max={1000000000}
              >
                <NumberInputField
                  color={colorMode === 'dark' ? 'white' : 'gray.800'}
                  _placeholder={{ color: colorMode === 'dark' ? 'gray.500' : 'gray.400' }}
                  borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.300'}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper 
                    borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.300'}
                    _hover={{ 
                      bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
                      borderColor: colorMode === 'dark' ? 'gray.500' : 'gray.400'
                    }}
                    _active={{ 
                      bg: colorMode === 'dark' ? 'gray.600' : 'gray.200',
                      borderColor: colorMode === 'dark' ? 'gray.500' : 'gray.400'
                    }}
                  />
                  <NumberDecrementStepper 
                    borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.300'}
                    _hover={{ 
                      bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
                      borderColor: colorMode === 'dark' ? 'gray.500' : 'gray.400'
                    }}
                     _active={{ 
                      bg: colorMode === 'dark' ? 'gray.600' : 'gray.200',
                      borderColor: colorMode === 'dark' ? 'gray.500' : 'gray.400'
                    }}
                  />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>Recipient Address</FormLabel>
              <Input
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                 _placeholder={{ color: colorMode === 'dark' ? 'gray.500' : 'gray.400' }}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Creating Token..."
            >
              Create Token
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreateToken; 