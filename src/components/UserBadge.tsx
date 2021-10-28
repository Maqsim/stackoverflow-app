import { Box, ButtonProps, HStack, Image, Text } from "@chakra-ui/react";
import UserPlaceholder from '../../assets/user-placeholder.jpeg';

export function UserBadge(props: ButtonProps) {
  return (
    <Box w="200px" p="8px" borderRadius="3px" bgColor="gray.200" fontSize="12px">
      <Text color="#777" mb="6px" lineHeight="12px">asked yestarday</Text>
      <HStack>
        <Image src={UserPlaceholder} boxSize="32px" objectFit="cover" borderRadius="3px" />
        <Box>
          <Text lineHeight="13px" my="1px">Max Diachenko</Text>
          <Text fontWeight="bold">1500</Text>
        </Box>
      </HStack>
    </Box>
  );
}
