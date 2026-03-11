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
  HStack,
  useToast,
  useColorMode,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Link,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { deployToken } from '../utils/token';

const FieldWrapper = ({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) => {
  const { colorMode } = useColorMode();
  return (
    <FormControl isRequired>
      <FormLabel mb={1.5}>{label}</FormLabel>
      {helper && <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.500' : 'gray.400'} mb={2}>{helper}</Text>}
      {children}
    </FormControl>
  );
};

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
      toast({ title: 'Please connect your wallet', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    if (!name || !symbol || !initialSupply || !recipientAddress) {
      toast({ title: 'Please fill in all fields', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    if (!ethers.utils.isAddress(recipientAddress)) {
      toast({ title: 'Invalid Recipient Address', description: 'Please enter a valid Ethereum address.', status: 'error', duration: 3000, isClosable: true });
      return;
    }
    try {
      setIsLoading(true);
      const tokenAddress = await deployToken(provider, name, symbol, initialSupply, recipientAddress);
      toast({
        title: '🎉 Token Deployed!',
        description: (
          <Box>
            <Text mb={1} fontSize="sm">Your token is live on Sepolia</Text>
            <Link
              href={`https://sepolia.etherscan.io/token/${tokenAddress}`}
              isExternal
              color="brand.300"
              fontSize="xs"
              fontFamily="mono"
            >
              {tokenAddress.slice(0, 18)}...
            </Link>
          </Box>
        ),
        status: 'success',
        duration: 12000,
        isClosable: true,
      });
      setName(''); setSymbol(''); setInitialSupply('1000000'); setRecipientAddress('');
    } catch (error) {
      toast({
        title: 'Deployment Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cardBg = colorMode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)';
  const cardBorder = colorMode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

  if (!isActive) {
    return (
      <Container maxW="480px" py={24} centerContent>
        <Box
          w="100%"
          p={10}
          borderRadius="24px"
          bg={cardBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={cardBorder}
          textAlign="center"
        >
          <VStack spacing={4}>
            <Box fontSize="48px">🔒</Box>
            <Heading size="md">Connect your wallet</Heading>
            <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>
              You need to connect MetaMask to deploy a token.
            </Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      {/* Ambient background */}
      <Box
        position="fixed" top="30%" left="60%"
        w="400px" h="400px" borderRadius="50%"
        bg={colorMode === 'dark' ? 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)'}
        pointerEvents="none" zIndex={0}
      />
      <Container maxW="600px" py={{ base: 10, md: 16 }} position="relative" zIndex={1}>
        <VStack spacing={8} align="stretch">

          {/* Header */}
          <VStack spacing={3} textAlign="center">
            <Badge
              px={3} py={1}
              borderRadius="full"
              bg={colorMode === 'dark' ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.08)'}
              border="1px solid"
              borderColor={colorMode === 'dark' ? 'rgba(168,85,247,0.3)' : 'rgba(168,85,247,0.2)'}
              color={colorMode === 'dark' ? '#d8b4fe' : '#7c3aed'}
              fontSize="xs"
              fontWeight="600"
              letterSpacing="0.08em"
              textTransform="uppercase"
            >
              ERC20 Token Factory
            </Badge>
            <Heading size="xl" letterSpacing="-0.03em">Launch Your Token</Heading>
            <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.500'} maxW="400px">
              Deploy your own ERC20 token on Ethereum Sepolia using the Token Factory contract.
            </Text>
          </VStack>

          {/* Info strip */}
          <SimpleGrid columns={3} spacing={3}>
            {[
              { label: 'Standard', value: 'ERC20' },
              { label: 'Network', value: 'Sepolia' },
              { label: 'Decimals', value: '18' },
            ].map(({ label, value }) => (
              <Box
                key={label}
                p={4}
                borderRadius="16px"
                bg={colorMode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)'}
                border="1px solid"
                borderColor={cardBorder}
                textAlign="center"
              >
                <Text fontSize="xs" color={colorMode === 'dark' ? 'gray.500' : 'gray.400'} mb={1}>{label}</Text>
                <Text fontSize="sm" fontWeight="700" color={colorMode === 'dark' ? 'white' : 'gray.800'}>{value}</Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Form */}
          <Box
            as="form"
            onSubmit={handleSubmit}
            p={{ base: 6, md: 8 }}
            borderRadius="24px"
            bg={cardBg}
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor={cardBorder}
          >
            <VStack spacing={5}>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5} w="100%">
                <FieldWrapper label="Token Name" helper="Full name of your token">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Awesome Token"
                  />
                </FieldWrapper>
                <FieldWrapper label="Symbol" helper="Short ticker (max 5 chars)">
                  <Input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="e.g. MAT"
                    maxLength={5}
                  />
                </FieldWrapper>
              </SimpleGrid>

              <FieldWrapper label="Initial Supply" helper="Total tokens minted at deployment">
                <NumberInput value={initialSupply} onChange={(v) => setInitialSupply(v)} min={1} max={1000000000}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FieldWrapper>

              <FieldWrapper label="Recipient Address" helper="Wallet that receives the initial supply">
                <Input
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  fontFamily="mono"
                  fontSize="sm"
                />
              </FieldWrapper>

              <Button
                type="submit"
                w="full"
                size="lg"
                borderRadius="14px"
                isLoading={isLoading}
                loadingText="Deploying..."
                bg="linear-gradient(135deg, #a855f7, #6366f1)"
                color="white"
                fontWeight="600"
                border="1px solid rgba(168,85,247,0.3)"
                _hover={{
                  bg: 'linear-gradient(135deg, #9333ea, #4f46e5)',
                  shadow: '0 8px 28px rgba(168,85,247,0.4)',
                  transform: 'translateY(-2px)',
                }}
                _disabled={{ opacity: 0.6, transform: 'none', cursor: 'not-allowed' }}
                transition="all 0.2s"
                mt={2}
              >
                Deploy Token
              </Button>
            </VStack>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default CreateToken;

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
              View on Sepolia Explorer:{' '}
              <Link
                href={`${process.env.BLOCK_EXPLORER_URL}/token/${tokenAddress}`}
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
          Deploy your own ERC20 token on the Ethereum Sepolia testnet using the Token Factory.
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