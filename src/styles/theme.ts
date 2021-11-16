import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const scrollbar = {
  '&::-webkit-scrollbar': {
    width: '4px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: mode('gray.300', 'gray.600'),
    borderRadius: '24px'
  }
};

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false
  },
  styles: {
    global: {
      ...scrollbar,
      body: {
        fontSize: '14px'
      }
    }
  }
});
