import { extendTheme } from '@chakra-ui/react';
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
