import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
  styles: {
    global: (props: any) => ({
      '@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap')",
      body: {
        bg: props.colorMode === 'dark' ? '#080b14' : '#f0f2f8',
        color: props.colorMode === 'dark' ? '#e2e8f0' : '#1a202c',
        minHeight: '100vh',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '::-webkit-scrollbar': { width: '6px' },
      '::-webkit-scrollbar-track': { bg: 'transparent' },
      '::-webkit-scrollbar-thumb': {
        bg: props.colorMode === 'dark' ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.3)',
        borderRadius: '3px',
      },
      '*': { boxSizing: 'border-box' },
    }),
  },
  colors: {
    brand: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    accent: {
      blue: '#6366f1',
      purple: '#8b5cf6',
      pink: '#ec4899',
      cyan: '#06b6d4',
    },
  },
  radii: {
    xl: '16px',
    '2xl': '20px',
    '3xl': '28px',
  },
  shadows: {
    glow: '0 0 30px rgba(139,92,246,0.3)',
    glowLg: '0 0 60px rgba(139,92,246,0.25)',
    card: '0 8px 32px rgba(0,0,0,0.3)',
    cardLight: '0 4px 24px rgba(0,0,0,0.08)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: '12px',
        letterSpacing: '0.01em',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
      },
      variants: {
        solid: (props: any) => ({
          bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          border: '1px solid',
          borderColor: 'rgba(139,92,246,0.3)',
          _hover: {
            bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            transform: 'translateY(-2px)',
            shadow: '0 8px 24px rgba(99,102,241,0.4)',
            _disabled: { transform: 'none', shadow: 'none' },
          },
          _active: { transform: 'translateY(0)' },
        }),
        ghost: (props: any) => ({
          color: props.colorMode === 'dark' ? 'gray.300' : 'gray.600',
          _hover: {
            bg: props.colorMode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            color: props.colorMode === 'dark' ? 'white' : 'gray.900',
          },
        }),
        outline: (props: any) => ({
          border: '1px solid',
          borderColor: props.colorMode === 'dark' ? 'rgba(139,92,246,0.4)' : 'rgba(99,102,241,0.4)',
          color: props.colorMode === 'dark' ? 'brand.300' : 'brand.600',
          bg: 'transparent',
          _hover: {
            bg: props.colorMode === 'dark' ? 'rgba(139,92,246,0.12)' : 'rgba(99,102,241,0.08)',
            shadow: '0 0 20px rgba(139,92,246,0.2)',
          },
        }),
        glass: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid',
          borderColor: props.colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          _hover: {
            bg: props.colorMode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9)',
            transform: 'translateY(-1px)',
          },
        }),
      },
    },
    Input: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            border: '1px solid',
            borderColor: props.colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderRadius: '12px',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
            _hover: {
              bg: props.colorMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              borderColor: 'brand.400',
            },
            _focus: {
              bg: props.colorMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'white',
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px rgba(139,92,246,0.5)',
            },
            _placeholder: {
              color: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
            },
          },
        }),
      },
      defaultProps: { variant: 'filled' },
    },
    NumberInput: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            border: '1px solid',
            borderColor: props.colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderRadius: '12px',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
            _hover: { borderColor: 'brand.400' },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px rgba(139,92,246,0.5)',
            },
          },
        }),
      },
      defaultProps: { variant: 'filled' },
    },
    FormLabel: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'gray.300' : 'gray.600',
        fontWeight: '500',
        fontSize: 'sm',
        letterSpacing: '0.03em',
        mb: 2,
      }),
    },
    Heading: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.900',
        letterSpacing: '-0.02em',
      }),
    },
  },
});

export default theme; 