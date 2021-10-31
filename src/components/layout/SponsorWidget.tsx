import { Box, BoxProps, Heading, HStack, Text } from '@chakra-ui/react';
import { IoIosHeart } from 'react-icons/io';

export function SponsorWidget(props: BoxProps) {
  return (
    <Box bgColor="whiteAlpha.200" color="whiteAlpha.900" fontSize="13px" borderRadius="5px" p="8px" mx="8px" {...props}>
      <Heading fontSize="11px" textTransform="uppercase" mb="6px">
        <HStack spacing="4px">
          <Text color="red.500">
            <IoIosHeart/>
          </Text>
          <Text>Become a sponsor</Text>
        </HStack>
      </Heading>
      <Text>That will help author to maintain and develop the application</Text>
    </Box>
  );
}
