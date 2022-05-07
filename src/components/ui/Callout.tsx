import { Box, BoxProps } from '@chakra-ui/react';

export function Callout(props: BoxProps) {
  return (
    <Box borderRadius="5px" bgColor="blue.50" border="1px solid" borderColor="blue.200" p="12px 16px" mb="16px">
      {props.children}
    </Box>
  );
}
