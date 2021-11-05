import { Box, BoxProps, Heading, HStack, Text } from '@chakra-ui/react';
import { IoIosHeart } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

export function SponsorWidget(props: BoxProps) {
  const navigate = useNavigate();

  function cl() {
    navigate('/questions/30340815');
  }

  return (
    <Box bgColor="whiteAlpha.200" color="whiteAlpha.900" fontSize="13px" borderRadius="5px" p="8px" mx="8px" {...props} onClick={cl}>
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
