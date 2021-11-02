import { Box, Center, Flex, HStack, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useRef } from 'react';

export function QuestionListItemSkeleton() {
  const titleWidth = useRef(Math.max(Math.random() * 100, 30));
  const tagsCount = useRef(Math.ceil(Math.random() * 5));

  return (
    <Flex align="center" py="8px">
      <HStack h="50px" flexShrink={0} mr="16px" spacing="2px" px="4px" border="1px solid" borderColor="gray.200" borderRadius="5px">
        <Stack p="4px" spacing="4px">
          <Center>
            <Skeleton w="18px" h="21px" />
          </Center>
          <Text>
            <Skeleton w="39px" h="12px" />
          </Text>
        </Stack>
        <Stack p="4px" spacing="4px">
          <Center>
            <Skeleton w="18px" h="21px" />
          </Center>
          <Text>
            <Skeleton w="39px" h="12px" />
          </Text>
        </Stack>
        <Stack p="4px" spacing="4px">
          <Center>
            <Skeleton w="18px" h="21px" />
          </Center>
          <Text>
            <Skeleton w="39px" h="12px" />
          </Text>
        </Stack>
      </HStack>

      <Box flexGrow={1}>
        <Skeleton h="21px" w={`${titleWidth.current}%`} />
        <HStack mt="4px" spacing="4px">
          {[...Array(tagsCount.current)].map((_, index) => (
            <RandomTag key={index} />
          ))}
        </HStack>
      </Box>
    </Flex>
  );
}

function RandomTag() {
  const width = useRef(Math.max(Math.random() * 100, 50));

  return <Skeleton h="23px" w={`${width.current}px`} />;
}
