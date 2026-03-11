import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorMode,
  SimpleGrid,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { EditIcon, ViewIcon, RepeatIcon, ArrowForwardIcon } from '@chakra-ui/icons';

const GlassCard = ({ children, ...props }: any) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      borderRadius="24px"
      border="1px solid"
      borderColor={colorMode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}
      bg={colorMode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)'}
      backdropFilter="blur(20px)"
      transition="all 0.35s cubic-bezier(0.4,0,0.2,1)"
      _hover={{
        borderColor: colorMode === 'dark' ? 'rgba(139,92,246,0.3)' : 'rgba(99,102,241,0.2)',
        shadow: colorMode === 'dark' ? '0 8px 40px rgba(139,92,246,0.15)' : '0 8px 40px rgba(99,102,241,0.1)',
        transform: 'translateY(-4px)',
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

const StepBadge = ({ n, color }: { n: string; color: string }) => (
  <Box
    w="44px" h="44px"
    borderRadius="12px"
    bg={`linear-gradient(135deg, ${color}33, ${color}22)`}
    border="1px solid"
    borderColor={`${color}44`}
    display="flex"
    alignItems="center"
    justifyContent="center"
    fontSize="18px"
    fontWeight="700"
    color={color}
    flexShrink={0}
  >
    {n}
  </Box>
);

const Home: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      {/* Background ambient orbs */}
      <Box
        position="fixed"
        top="-200px"
        left="-200px"
        w="600px"
        h="600px"
        borderRadius="50%"
        bg={colorMode === 'dark' ? 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)'}
        pointerEvents="none"
        zIndex={0}
      />
      <Box
        position="fixed"
        bottom="-100px"
        right="-100px"
        w="500px"
        h="500px"
        borderRadius="50%"
        bg={colorMode === 'dark' ? 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)'}
        pointerEvents="none"
        zIndex={0}
      />

      <Container maxW="1100px" py={{ base: 12, md: 20 }} position="relative" zIndex={1}>
        <VStack spacing={{ base: 16, md: 24 }}>

          {/* ── Hero ── */}
          <VStack spacing={6} textAlign="center" maxW="820px" mx="auto">
            <Badge
              px={4} py={1.5}
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
              ⚡ Ethereum Sepolia Testnet
            </Badge>

            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="800"
              lineHeight="1.1"
              letterSpacing="-0.03em"
            >
              Launch Your{' '}
              <Box
                as="span"
                bgGradient="linear(to-r, #6366f1, #8b5cf6, #a855f7)"
                bgClip="text"
              >
                Digital Assets
              </Box>
              <br />on-chain
            </Heading>

            <Text
              fontSize={{ base: 'md', md: 'xl' }}
              color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}
              maxW="560px"
              lineHeight="1.8"
            >
              Create and deploy NFTs and ERC20 tokens on Ethereum Sepolia in minutes — no coding required.
            </Text>

            <HStack spacing={4} pt={2} flexWrap="wrap" justify="center">
              <Button
                as={RouterLink}
                to="/canvas"
                size="lg"
                px={8}
                borderRadius="14px"
                bg="linear-gradient(135deg, #6366f1, #8b5cf6)"
                color="white"
                fontWeight="600"
                border="1px solid rgba(139,92,246,0.3)"
                rightIcon={<ArrowForwardIcon />}
                _hover={{
                  bg: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  shadow: '0 8px 28px rgba(99,102,241,0.45)',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.2s"
              >
                Create NFT
              </Button>
              <Button
                as={RouterLink}
                to="/createtoken"
                size="lg"
                px={8}
                borderRadius="14px"
                variant="outline"
                rightIcon={<ArrowForwardIcon />}
              >
                Launch Token
              </Button>
            </HStack>
          </VStack>

          {/* ── Action Cards ── */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
            {/* NFT Card */}
            <GlassCard p={8}>
              <VStack align="start" spacing={5}>
                <Box
                  w="52px" h="52px" borderRadius="14px"
                  bg="linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))"
                  border="1px solid rgba(139,92,246,0.25)"
                  display="flex" alignItems="center" justifyContent="center"
                  fontSize="24px"
                >
                  🎨
                </Box>
                <Box>
                  <Heading size="md" mb={2}>Create NFT</Heading>
                  <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.500'} fontSize="sm" lineHeight="1.7">
                    Design and mint NFTs using our drawing board or upload your own artwork. Each NFT is stored on IPFS.
                  </Text>
                </Box>
                <Button
                  as={RouterLink}
                  to="/canvas"
                  size="sm"
                  px={5}
                  borderRadius="10px"
                  bg="linear-gradient(135deg, #6366f1, #8b5cf6)"
                  color="white"
                  fontWeight="600"
                  border="1px solid rgba(139,92,246,0.3)"
                  rightIcon={<ArrowForwardIcon />}
                  _hover={{
                    bg: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    shadow: '0 4px 20px rgba(99,102,241,0.4)',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                >
                  Start Creating
                </Button>
              </VStack>
            </GlassCard>

            {/* Token Card */}
            <GlassCard p={8}>
              <VStack align="start" spacing={5}>
                <Box
                  w="52px" h="52px" borderRadius="14px"
                  bg="linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))"
                  border="1px solid rgba(168,85,247,0.25)"
                  display="flex" alignItems="center" justifyContent="center"
                  fontSize="24px"
                >
                  🪙
                </Box>
                <Box>
                  <Heading size="md" mb={2}>Launch Token</Heading>
                  <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.500'} fontSize="sm" lineHeight="1.7">
                    Deploy your own ERC20 token with a custom name, symbol and supply — powered by the Token Factory contract.
                  </Text>
                </Box>
                <Button
                  as={RouterLink}
                  to="/createtoken"
                  size="sm"
                  px={5}
                  borderRadius="10px"
                  bg="linear-gradient(135deg, #a855f7, #ec4899)"
                  color="white"
                  fontWeight="600"
                  border="1px solid rgba(168,85,247,0.3)"
                  rightIcon={<ArrowForwardIcon />}
                  _hover={{
                    bg: 'linear-gradient(135deg, #9333ea, #db2777)',
                    shadow: '0 4px 20px rgba(168,85,247,0.4)',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                >
                  Create Token
                </Button>
              </VStack>
            </GlassCard>
          </SimpleGrid>

          {/* ── How It Works ── */}
          <VStack spacing={8} w="100%">
            <VStack spacing={2} textAlign="center">
              <Text
                fontSize="xs"
                fontWeight="700"
                letterSpacing="0.12em"
                textTransform="uppercase"
                color={colorMode === 'dark' ? 'brand.400' : 'brand.600'}
              >
                Process
              </Text>
              <Heading size="xl">How it works</Heading>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} w="100%">
              {[
                { n: '1', icon: '🔗', color: '#6366f1', title: 'Connect Wallet', desc: 'Connect MetaMask to Ethereum Sepolia to get started.' },
                { n: '2', icon: '✏️', color: '#8b5cf6', title: 'Design or Define', desc: 'Draw your NFT artwork or configure your ERC20 token parameters.' },
                { n: '3', icon: '🚀', color: '#a855f7', title: 'Deploy On-Chain', desc: 'Mint or deploy your contract directly to Sepolia with one click.' },
              ].map(({ n, icon, color, title, desc }) => (
                <GlassCard key={n} p={7}>
                  <VStack align="start" spacing={4}>
                    <HStack spacing={3}>
                      <StepBadge n={icon} color={color} />
                      <Text fontSize="xs" fontWeight="700" color={color} letterSpacing="0.06em">STEP {n}</Text>
                    </HStack>
                    <Box>
                      <Heading size="sm" mb={2}>{title}</Heading>
                      <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.500'} fontSize="sm" lineHeight="1.7">{desc}</Text>
                    </Box>
                  </VStack>
                </GlassCard>
              ))}
            </SimpleGrid>
          </VStack>

          {/* ── CTA Banner ── */}
          <Box
            w="100%"
            borderRadius="24px"
            p={{ base: 8, md: 12 }}
            bg="linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(168,85,247,0.1) 100%)"
            border="1px solid"
            borderColor={colorMode === 'dark' ? 'rgba(139,92,246,0.2)' : 'rgba(99,102,241,0.15)'}
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="-80px"
              right="-80px"
              w="250px"
              h="250px"
              borderRadius="50%"
              bg="radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)"
              pointerEvents="none"
            />
            <VStack spacing={5} position="relative">
              <Heading size="lg">Ready to explore your collection?</Heading>
              <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.500'} maxW="440px">
                View and manage all your minted NFTs in one place.
              </Text>
              <Button
                as={RouterLink}
                to="/collection"
                size="lg"
                px={8}
                borderRadius="14px"
                bg="linear-gradient(135deg, #6366f1, #8b5cf6)"
                color="white"
                fontWeight="600"
                border="1px solid rgba(139,92,246,0.3)"
                rightIcon={<ArrowForwardIcon />}
                _hover={{
                  bg: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  shadow: '0 8px 28px rgba(99,102,241,0.45)',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.2s"
              >
                View My Collection
              </Button>
            </VStack>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default Home;

import { Link as RouterLink } from 'react-router-dom';
import { EditIcon, ViewIcon, RepeatIcon } from '@chakra-ui/icons';

const FeatureCard = ({ icon, title, description }: { icon: any; title: string; description: string }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      p={6}
      borderRadius="2xl"
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      borderWidth="1px"
      borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
      shadow="lg"
      _hover={{ shadow: '2xl', transform: 'translateY(-4px)', borderColor: 'blue.400' }}
      transition="all 0.2s"
    >
      <VStack spacing={4} align="center">
        <Icon as={icon} w={10} h={10} color="blue.400" />
        <Heading size="md">{title}</Heading>
        <Text textAlign="center" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
          {description}
        </Text>
      </VStack>
    </Box>
  );
};

const Home: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Container maxW="container.xl" py={16}>
      <VStack spacing={16}>
        {/* Hero Section */}
        <Box textAlign="center" maxW="1000px" px={6}>
          <Heading
            as="h1"
            size="4xl"
            mb={8}
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
            lineHeight="1.3"
            letterSpacing="tight"
          >
            Create and Manage Your Digital Assets on Ethereum Sepolia
          </Heading>
          <Text 
            fontSize="2xl" 
            color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
            maxW="900px"
            mx="auto"
            lineHeight="1.8"
            mb={4}
          >
            Easily create and deploy your own NFTs and ERC20 tokens on the Ethereum Sepolia testnet with our intuitive platform.
          </Text>
        </Box>

        {/* Creation Options */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} w="100%" maxW="1000px">
          <Box
            p={10}
            borderRadius="2xl"
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            borderWidth={1}
            borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
            shadow="lg"
            _hover={{
              transform: 'translateY(-4px)',
              shadow: 'xl',
            }}
            transition="all 0.3s ease"
          >
            <VStack spacing={6}>
              <Icon as={EditIcon} w={16} h={16} color="blue.500" />
              <Heading size="xl">Create NFT</Heading>
              <Text 
                fontSize="lg"
                color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                lineHeight="1.6"
              >
                Design and mint your own NFTs using our intuitive drawing board or upload your artwork.
              </Text>
              <Button
                as={RouterLink}
                to="/canvas"
                colorScheme="blue"
                size="lg"
                width={{ base: '100%', md: 'auto' }}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                transition="all 0.2s"
                px={8}
                py={6}
                fontSize="lg"
              >
                Start Creating
              </Button>
            </VStack>
          </Box>

          <Box
            p={10}
            borderRadius="2xl"
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            borderWidth={1}
            borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
            shadow="lg"
            _hover={{
              transform: 'translateY(-4px)',
              shadow: 'xl',
            }}
            transition="all 0.3s ease"
          >
            <VStack spacing={6}>
              <Icon as={RepeatIcon} w={16} h={16} color="purple.500" />
              <Heading size="xl">Create Token</Heading>
              <Text 
                fontSize="lg"
                color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                lineHeight="1.6"
              >
                Deploy your own ERC20 token on Ethereum Sepolia with customizable parameters and features.
              </Text>
              <Button
                as={RouterLink}
                to="/createtoken"
                colorScheme="purple"
                size="lg"
                width={{ base: '100%', md: 'auto' }}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                transition="all 0.2s"
                px={8}
                py={6}
                fontSize="lg"
              >
                Create Token
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* How It Works Section */}
        <VStack spacing={12} w="100%" maxW="1000px">
          <Heading textAlign="center" size="2xl" mb={4}>How It Works</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="100%">
            <Box
              p={8}
              borderRadius="lg"
              bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
              borderWidth="1px"
              borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
              shadow="md"
            >
              <VStack spacing={4} align="center">
                <Icon as={ViewIcon} w={12} h={12} color="green.500" />
                <Heading size="md">1. Connect Wallet</Heading>
                <Text textAlign="center" fontSize="md" color={colorMode === 'dark' ? 'gray.400' : 'gray.700'} lineHeight="1.6">
                  Securely connect your Web3 wallet (like MetaMask) to interact with the Ethereum Sepolia network.
                </Text>
              </VStack>
            </Box>
            <Box
              p={8}
              borderRadius="lg"
              bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
              borderWidth="1px"
              borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
              shadow="md"
            >
              <VStack spacing={4} align="center">
                <Icon as={EditIcon} w={12} h={12} color="orange.500" />
                <Heading size="md">2. Design or Define</Heading>
                <Text textAlign="center" fontSize="md" color={colorMode === 'dark' ? 'gray.400' : 'gray.700'} lineHeight="1.6">
                  Create your NFT artwork or define the parameters for your new ERC20 token.
                </Text>
              </VStack>
            </Box>
            <Box
              p={8}
              borderRadius="lg"
              bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
              borderWidth="1px"
              borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
              shadow="md"
            >
              <VStack spacing={4} align="center">
                <Icon as={RepeatIcon} w={12} h={12} color="purple.500" />
                <Heading size="md">3. Deploy to Sepolia</Heading>
                <Text textAlign="center" fontSize="md" color={colorMode === 'dark' ? 'gray.400' : 'gray.700'} lineHeight="1.6">
                  Deploy your NFT or token contract directly to the Ethereum Sepolia testnet with a few clicks.
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>

        {/* View Collection Section */}
        <Box
          p={10}
          borderRadius="2xl"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          borderWidth={1}
          borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
          shadow="lg"
          w="100%"
          maxW="1000px"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Heading size="xl">Manage Your Digital Assets</Heading>
            <Text 
              fontSize="lg"
              color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
              lineHeight="1.6"
            >
              View and manage all your created NFTs and tokens in your personalized collection.
            </Text>
            <Button
              as={RouterLink}
              to="/collection"
              colorScheme="green"
              size="lg"
              width={{ base: '100%', md: 'auto' }}
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
              }}
              transition="all 0.2s"
              px={8}
              py={6}
              fontSize="lg"
            >
              View My Collection
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Home; 