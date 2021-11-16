import { mode } from '@chakra-ui/theme-tools';

export default {
  '&::-webkit-scrollbar': {
    width: '4px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: mode('gray.300', 'gray.600'),
    borderRadius: '4px'
  }
};
