import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { ChakraTheme } from '@chakra-ui/theme/dist/types/theme.types';
import scrollbar from './scrollbar';

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
