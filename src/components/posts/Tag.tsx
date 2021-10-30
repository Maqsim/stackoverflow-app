import { Tag as ChakraTag, TagLabel, TagProps, TagRightIcon, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';

type Props = {
  colorScheme?: string;
  icon?: IconType;
  iconColor?: string;
  children: ReactNode;
};

export function Tag({ colorScheme, icon, iconColor, children }: Props) {
  const tagBg = useColorModeValue('gray.200', 'gray.600');

  return (
    <ChakraTag mr="4px" mb="4px" colorScheme="gray" borderRadius="3px" fontSize="13px">
      <TagLabel>{children}</TagLabel>
      {icon && <TagRightIcon color={iconColor ? iconColor : 'gray.400'} as={icon} />}
    </ChakraTag>
  );
}
