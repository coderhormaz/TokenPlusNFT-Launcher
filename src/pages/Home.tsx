import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useColorMode,
  Image,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
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
            Create and Manage Your Digital Assets on Base
          </Heading>
          <Text 
            fontSize="2xl" 
            color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
            maxW="900px"
            mx="auto"
            lineHeight="1.8"
            mb={4}
          >
            Easily create and deploy your own NFTs and ERC20 tokens on the Base blockchain with our intuitive platform.
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
                Deploy your own ERC20 token on Base with customizable parameters and features.
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
                  Securely connect your Web3 wallet (like MetaMask) to interact with the Base network.
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
                <Heading size="md">3. Deploy to Base</Heading>
                <Text textAlign="center" fontSize="md" color={colorMode === 'dark' ? 'gray.400' : 'gray.700'} lineHeight="1.6">
                  Deploy your NFT or token contract directly to the Base blockchain with a few clicks.
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