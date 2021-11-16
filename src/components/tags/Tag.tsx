import { Tag as ChakraTag, TagCloseButton, TagLabel, useColorModeValue } from '@chakra-ui/react';

type Props = {
  bgColor?: string;
  color?: string;
  isRemovable?: boolean;
  onRemove?: (tag: string) => void;
  children: string;
};

export function Tag({ bgColor, color, isRemovable, onRemove, children }: Props) {
  const tagBg = useColorModeValue('gray.200', 'gray.600');

  return (
    <ChakraTag mr="4px" mb="4px" bgColor={bgColor} color={color} borderRadius="3px" fontSize="13px">
      <TagLabel>{children}</TagLabel>
      {isRemovable && onRemove && <TagCloseButton onClick={() => onRemove(children)} />}
    </ChakraTag>
  );
}
