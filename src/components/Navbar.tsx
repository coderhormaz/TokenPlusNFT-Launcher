import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  useToast,
  IconButton,
  useColorMode,
  VStack,
  useBreakpointValue,
  Text,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { injected } from '../utils/connectors';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Navbar: React.FC = () => {
  const { activate, deactivate, account, active: isActive } = useWeb3React<Web3Provider>();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: 'MetaMask not installed',
          description: 'Please install MetaMask to use this app',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      await activate(injected, undefined, true);
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x2105' && chainId !== '0x14a33') {
        toast({
          title: 'Wrong Network',
          description: 'Please switch to Base network',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Wallet Connected',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: 'Error connecting wallet',
        description: error.message || 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const disconnectWallet = () => {
    deactivate();
    toast({
      title: 'Wallet Disconnected',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const DesktopNavLinks = () => (
    <>
      <Button as={RouterLink} to="/" variant="ghost" onClick={() => setIsOpen(false)}>
        Home
      </Button>
      <Button as={RouterLink} to="/canvas" variant="ghost" onClick={() => setIsOpen(false)}>
        Create NFT
      </Button>
      <Button as={RouterLink} to="/createtoken" variant="ghost" onClick={() => setIsOpen(false)}>
        Create Token
      </Button>
      <Button as={RouterLink} to="/collection" variant="ghost" onClick={() => setIsOpen(false)}>
        My Collection
      </Button>
    </>
  );

  return (
    <Box 
      px={4} 
      py={2} 
      shadow="md" 
      mb={6}
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(10px)"
      bg={colorMode === 'dark' ? 'rgba(45, 55, 72, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {isMobile ? (
          <>
            <MotionBox
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <IconButton
                className="menu-button"
                aria-label="Open menu"
                icon={
                  <Box
                    as="span"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    transform={isOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
                    display="inline-block"
                  >
                    ☰
                  </Box>
                }
                onClick={() => setIsOpen(!isOpen)}
                variant="ghost"
                fontSize="24px"
                _hover={{
                  bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              />
            </MotionBox>
            <Box
              className="mobile-menu"
              position="fixed"
              top="0"
              left="0"
              w="100%"
              h="100vh"
              bg={colorMode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)'}
              backdropFilter="blur(4px)"
              transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              opacity={isOpen ? 1 : 0}
              visibility={isOpen ? 'visible' : 'hidden'}
              zIndex={1000}
              willChange="transform, opacity"
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                w="280px"
                h="100%"
                bg={colorMode === 'dark' ? 'gray.800' : 'white'}
                borderRight="1px solid"
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
                transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                overflowY="auto"
                boxShadow={isOpen ? '2xl' : 'none'}
                _hover={{
                  boxShadow: '2xl',
                }}
                willChange="transform"
              >
                <Flex
                  p={4}
                  borderBottomWidth="1px"
                  borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
                  justify="space-between"
                  align="center"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                  <Text 
                    fontSize="2xl" 
                    fontWeight="bold"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    transform={isOpen ? 'translateX(0)' : 'translateX(-20px)'}
                    opacity={isOpen ? 1 : 0}
                    willChange="transform, opacity"
                  >
                    Menu
                  </Text>
                  <IconButton
                    aria-label="Close menu"
                    icon={
                      <Box
                        as="span"
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        transform={isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'}
                        display="inline-block"
                      >
                        ✕
                      </Box>
                    }
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    _hover={{
                      bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
                      transform: 'scale(1.1)',
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  />
                </Flex>
                <Box 
                  p={6}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  transform={isOpen ? 'translateX(0)' : 'translateX(-20px)'}
                  opacity={isOpen ? 1 : 0}
                  willChange="transform, opacity"
                >
                  <VStack spacing={4} align="stretch" w="100%">
                    <Button
                      as={RouterLink}
                      to="/"
                      variant="ghost"
                      onClick={() => setIsOpen(false)}
                      size="lg"
                      justifyContent="flex-start"
                      leftIcon={<span>🏠</span>}
                      _hover={{
                        bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
                        transform: 'translateX(8px)',
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      Home
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/canvas"
                      variant="ghost"
                      onClick={() => setIsOpen(false)}
                      size="lg"
                      justifyContent="flex-start"
                      leftIcon={<span>🎨</span>}
                      _hover={{
                        bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
                        transform: 'translateX(8px)',
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      Create NFT
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/createtoken"
                      variant="ghost"
                      onClick={() => setIsOpen(false)}
                      size="lg"
                      justifyContent="flex-start"
                      leftIcon={<span>🪙</span>}
                      _hover={{
                        bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
                        transform: 'translateX(8px)',
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      Create Token
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/collection"
                      variant="ghost"
                      onClick={() => setIsOpen(false)}
                      size="lg"
                      justifyContent="flex-start"
                      leftIcon={<span>🖼️</span>}
                      _hover={{
                        bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
                        transform: 'translateX(8px)',
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      My Collection
                    </Button>
                  </VStack>
                  <Divider my={6} />
                  <VStack spacing={4} align="stretch">
                    <Button
                      onClick={toggleColorMode}
                      variant="ghost"
                      size="lg"
                      justifyContent="flex-start"
                      leftIcon={<span>{colorMode === 'dark' ? '🌞' : '🌙'}</span>}
                      _hover={{
                        bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
                        transform: 'translateX(8px)',
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      {colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                    {isActive ? (
                      <Button
                        onClick={disconnectWallet}
                        colorScheme="red"
                        variant="outline"
                        size="lg"
                        justifyContent="flex-start"
                        leftIcon={<span>🔌</span>}
                        _hover={{
                          bg: 'red.50',
                          transform: 'translateX(8px)',
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        {account?.slice(0, 6)}...{account?.slice(-4)}
                      </Button>
                    ) : (
                      <Button
                        onClick={connectWallet}
                        colorScheme="blue"
                        size="lg"
                        justifyContent="flex-start"
                        leftIcon={<span>🔗</span>}
                        _hover={{
                          transform: 'translateX(8px)',
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        Connect Wallet
                      </Button>
                    )}
                  </VStack>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <Flex gap={4}>
            <DesktopNavLinks />
          </Flex>
        )}
        <Flex gap={4} align="center">
          <MotionBox
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              aria-label="Toggle color mode"
              icon={<span>{colorMode === 'dark' ? '🌞' : '🌙'}</span>}
              onClick={toggleColorMode}
              variant="ghost"
              fontSize="20px"
              _hover={{
                bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
              }}
            />
          </MotionBox>
          {isActive ? (
            <Button
              onClick={disconnectWallet}
              colorScheme="red"
              variant="outline"
              leftIcon={<span>🔌</span>}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              {account?.slice(0, 6)}...{account?.slice(-4)}
            </Button>
          ) : (
            <Button
              onClick={connectWallet}
              colorScheme="blue"
              leftIcon={<span>🔗</span>}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              Connect Wallet
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar; 