import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { ChakraTheme } from '@chakra-ui/theme/dist/types/theme.types';

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false
  },
  styles: {
    global: {
      body: {
        fontSize: '14px'
      }
    }
  }
});
