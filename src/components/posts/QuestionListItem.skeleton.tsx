import { Box, Center, Flex, HStack, Skeleton, Stack } from '@chakra-ui/react';
import { useRef } from 'react';
import randomRange from '../../uitls/random-range';
import { TagSkeleton } from '../tags/Tag.skeleton';

export function QuestionListItemSkeleton() {
  const titleWidth = useRef(randomRange(30, 100));
  const tagsCount = useRef(Math.ceil(Math.random() * 5));

  return (
    <Flex align="center" py="8px">
      <HStack
        h="50px"
        flexShrink={0}
        mr="16px"
        spacing="2px"
        px="4px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="5px"
      >
        <Stack p="4px" spacing="4px">
          <Center>
            <Skeleton w="18px" h="21px" />
          </Center>
          <Box>
            <Skeleton w="39px" h="12px" />
          </Box>
        </Stack>
        <Stack p="4px" spacing="4px">
          <Center>
            <Skeleton w="18px" h="21px" />
          </Center>
          <Box>
            <Skeleton w="39px" h="12px" />
          </Box>
        </Stack>
        <Stack p="4px" spacing="4px">
          <Center>
            <Skeleton w="18px" h="21px" />
          </Center>
          <Box>
            <Skeleton w="39px" h="12px" />
          </Box>
        </Stack>
      </HStack>

      <Box flexGrow={1}>
        <Skeleton h="16px" w={`${titleWidth.current}%`} />
        <Box mt="7px" h="24px">
          <Skeleton display="inline-flex" mr="10px" h="24px" w="59px" />
          {[...Array(tagsCount.current)].map((_, index) => (
            <TagSkeleton key={index} />
          ))}
        </Box>
      </Box>
    </Flex>
  );
}

