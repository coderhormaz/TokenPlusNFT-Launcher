import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
      },
    }),
  },
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'blue.500' : 'blue.600',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'blue.600' : 'blue.700',
          },
        }),
      },
    },
    Input: {
      baseStyle: (props: any) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          _hover: {
            borderColor: 'blue.400',
          },
          _focus: {
            borderColor: 'blue.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
          },
        },
      }),
    },
    Textarea: {
      baseStyle: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        _hover: {
          borderColor: 'blue.400',
        },
        _focus: {
          borderColor: 'blue.400',
          boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
        },
      }),
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
        },
      }),
    },
    Box: {
      baseStyle: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
      }),
    },
    Text: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
      }),
    },
    Heading: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      }),
    },
    Container: {
      baseStyle: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      }),
    },
    FormLabel: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.700',
      }),
    },
  },
});

export default theme; 