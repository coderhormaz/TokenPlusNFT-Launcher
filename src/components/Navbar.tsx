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
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { injected } from '../utils/connectors';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const NavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => {
  const location = useLocation();
  const { colorMode } = useColorMode();
  const isActive = location.pathname === to;
  return (
    <Button
      as={RouterLink}
      to={to}
      variant="ghost"
      onClick={onClick}
      size="sm"
      px={4}
      fontWeight={isActive ? '600' : '400'}
      color={isActive
        ? (colorMode === 'dark' ? 'white' : 'gray.900')
        : (colorMode === 'dark' ? 'gray.400' : 'gray.500')}
      position="relative"
      _hover={{
        bg: 'transparent',
        color: colorMode === 'dark' ? 'white' : 'gray.900',
      }}
      _after={isActive ? {
        content: '""',
        position: 'absolute',
        bottom: '-2px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '20px',
        height: '2px',
        borderRadius: '2px',
        bg: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
      } : {}}
    >
      {children}
    </Button>
  );
};

const Navbar: React.FC = () => {
  const { activate, deactivate, account, active: isActive } = useWeb3React<Web3Provider>();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({ title: 'MetaMask not installed', description: 'Please install MetaMask to use this app', status: 'error', duration: 5000, isClosable: true });
        return;
      }
      await activate(injected, undefined, true);
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') {
        toast({ title: 'Wrong Network', description: 'Please switch to Sepolia network', status: 'warning', duration: 5000, isClosable: true });
      } else {
        toast({ title: 'Wallet Connected', status: 'success', duration: 3000, isClosable: true });
      }
    } catch (error: any) {
      toast({ title: 'Error connecting wallet', description: error.message || 'Please try again', status: 'error', duration: 5000, isClosable: true });
    }
  };

  const disconnectWallet = () => {
    deactivate();
    toast({ title: 'Wallet Disconnected', status: 'info', duration: 3000, isClosable: true });
  };

  const navBg = colorMode === 'dark'
    ? scrolled ? 'rgba(8,11,20,0.85)' : 'rgba(8,11,20,0.6)'
    : scrolled ? 'rgba(240,242,248,0.9)' : 'rgba(240,242,248,0.7)';

  return (
    <Box
      px={{ base: 4, md: 8 }}
      py={3}
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(20px)"
      WebkitBackdropFilter="blur(20px)"
      bg={navBg}
      borderBottom="1px solid"
      borderColor={colorMode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
      transition="all 0.3s ease"
      boxShadow={scrolled ? (colorMode === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)') : 'none'}
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* Logo */}
        <RouterLink to="/">
          <HStack spacing={2}>
            <Box
              w="32px"
              h="32px"
              borderRadius="8px"
              bg="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="16px"
              shadow="0 4px 12px rgba(99,102,241,0.4)"
            >
              ⬡
            </Box>
            <Text
              fontWeight="700"
              fontSize="lg"
              letterSpacing="-0.02em"
              bgGradient="linear(to-r, #6366f1, #8b5cf6)"
              bgClip="text"
              display={{ base: 'none', sm: 'block' }}
            >
              LaunchPad
            </Text>
          </HStack>
        </RouterLink>

        {/* Desktop Nav Links */}
        {!isMobile && (
          <HStack spacing={1}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/canvas">Create NFT</NavLink>
            <NavLink to="/createtoken">Create Token</NavLink>
            <NavLink to="/collection">Collection</NavLink>
          </HStack>
        )}

        {/* Right Controls */}
        <HStack spacing={2}>
          <IconButton
            aria-label="Toggle color mode"
            icon={<Box fontSize="16px">{colorMode === 'dark' ? '☀️' : '🌙'}</Box>}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
            borderRadius="10px"
            _hover={{ bg: colorMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}
          />
          {isActive ? (
            <Button
              onClick={disconnectWallet}
              size="sm"
              borderRadius="10px"
              bg={colorMode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}
              border="1px solid"
              borderColor={colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
              color={colorMode === 'dark' ? 'gray.200' : 'gray.700'}
              fontFamily="mono"
              fontSize="xs"
              px={4}
              _hover={{ bg: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.3)', color: 'red.400' }}
              transition="all 0.2s"
            >
              {account?.slice(0, 6)}...{account?.slice(-4)}
            </Button>
          ) : (
            <Button
              onClick={connectWallet}
              size="sm"
              px={5}
              borderRadius="10px"
              bg="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              color="white"
              fontWeight="600"
              fontSize="sm"
              border="1px solid rgba(139,92,246,0.3)"
              _hover={{
                bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                shadow: '0 4px 16px rgba(99,102,241,0.4)',
                transform: 'translateY(-1px)',
              }}
              transition="all 0.2s"
            >
              Connect
            </Button>
          )}
          {isMobile && (
            <IconButton
              className="menu-button"
              aria-label="Open menu"
              icon={
                <Box
                  as="span"
                  transition="all 0.3s"
                  transform={isOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
                  display="inline-block"
                  fontSize="18px"
                >
                  {isOpen ? '✕' : '☰'}
                </Box>
              }
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              size="sm"
              borderRadius="10px"
              _hover={{ bg: colorMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}
            />
          )}
        </HStack>
      </Flex>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <Box
          className="mobile-menu"
          position="fixed"
          top="0"
          left="0"
          w="100%"
          h="100vh"
          bg="rgba(0,0,0,0.6)"
          backdropFilter="blur(8px)"
          transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          opacity={isOpen ? 1 : 0}
          visibility={isOpen ? 'visible' : 'hidden'}
          zIndex={1000}
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            w="300px"
            h="100%"
            bg={colorMode === 'dark' ? 'rgba(8,11,20,0.97)' : 'rgba(250,250,255,0.97)'}
            backdropFilter="blur(20px)"
            borderRight="1px solid"
            borderColor={colorMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
            transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            boxShadow="2xl"
          >
            <Flex
              p={5}
              borderBottom="1px solid"
              borderColor={colorMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
              justify="space-between"
              align="center"
            >
              <HStack spacing={2}>
                <Box
                  w="28px" h="28px" borderRadius="7px"
                  bg="linear-gradient(135deg, #6366f1, #8b5cf6)"
                  display="flex" alignItems="center" justifyContent="center" fontSize="14px"
                >⬡</Box>
                <Text fontWeight="700" bgGradient="linear(to-r, #6366f1, #8b5cf6)" bgClip="text">LaunchPad</Text>
              </HStack>
              <IconButton
                aria-label="Close menu"
                icon={<Box fontSize="14px">✕</Box>}
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                borderRadius="8px"
              />
            </Flex>
            <Box p={5}>
              <VStack spacing={1} align="stretch">
                {[
                  { to: '/', icon: '🏠', label: 'Home' },
                  { to: '/canvas', icon: '🎨', label: 'Create NFT' },
                  { to: '/createtoken', icon: '🪙', label: 'Create Token' },
                  { to: '/collection', icon: '🖼️', label: 'My Collection' },
                ].map(({ to, icon, label }) => (
                  <Button
                    key={to}
                    as={RouterLink}
                    to={to}
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    size="md"
                    justifyContent="flex-start"
                    leftIcon={<Box fontSize="16px">{icon}</Box>}
                    borderRadius="10px"
                    fontWeight="500"
                    color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                    _hover={{
                      bg: colorMode === 'dark' ? 'rgba(139,92,246,0.1)' : 'rgba(99,102,241,0.06)',
                      color: colorMode === 'dark' ? 'white' : 'gray.900',
                      transform: 'translateX(4px)',
                    }}
                    transition="all 0.2s"
                  >
                    {label}
                  </Button>
                ))}
              </VStack>
              <Divider my={5} borderColor={colorMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} />
              <Button
                onClick={toggleColorMode}
                variant="ghost"
                size="md"
                w="full"
                justifyContent="flex-start"
                leftIcon={<Box fontSize="16px">{colorMode === 'dark' ? '☀️' : '🌙'}</Box>}
                borderRadius="10px"
                fontWeight="500"
                color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                _hover={{ bg: colorMode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
              >
                {colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;

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
      if (chainId !== '0xaa36a7') {
        toast({
          title: 'Wrong Network',
          description: 'Please switch to Sepolia network',
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