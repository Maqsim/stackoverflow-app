import { Tag as ChakraTag, TagLabel, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  bgColor?: string;
  color?: string;
  children: ReactNode;
};

export function Tag({ bgColor, color, children }: Props) {
  const tagBg = useColorModeValue('gray.200', 'gray.600');

  return (
    <ChakraTag mr="4px" mb="4px" bgColor={bgColor} color={color} borderRadius="3px" fontSize="13px">
      <TagLabel>{children}</TagLabel>
    </ChakraTag>
  );
}
