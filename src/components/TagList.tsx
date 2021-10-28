import { Box, HStack, useColorModeValue } from '@chakra-ui/react';

type Props = {
  tags: string[];
};

export function TagList({ tags }: Props) {
  const tagBg = useColorModeValue('gray.200', 'gray.600');

  return (
    <HStack mt="4px" spacing="4px">
      {tags.map((tag) => (
        <Box p="2px 6px" fontSize="13px" borderRadius="3px" bgColor={tagBg} key={tag}>
          {tag}
        </Box>
      ))}
    </HStack>
  );
}
