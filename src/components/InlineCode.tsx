import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

export function InlineCode(props: BoxProps) {
  const bgColor = useColorModeValue('#eee', 'gray.700');

  return (
    <Box as="code" p="2px 4px" borderRadius="2px" bgColor={bgColor} display="inline" {...props} />
  );
}
