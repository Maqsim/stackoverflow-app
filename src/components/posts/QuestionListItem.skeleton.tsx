import { Box, HStack, Skeleton } from '@chakra-ui/react';
import { useRef } from 'react';

export function QuestionListItemSkeleton() {
  const titleWidth = useRef(Math.max(Math.random() * 100, 30));
  const tagsCount = useRef(Math.ceil(Math.random() * 5));

  return (
    <Box p="8px 12px">
      <Skeleton h="21px" w={`${titleWidth.current}%`} />
      <HStack mt="4px" spacing="6px">
        {[...Array(tagsCount.current)].map((_, index) => (
          <RandomTag key={index} />
        ))}
      </HStack>
    </Box>
  );
}

function RandomTag() {
  const width = useRef(Math.max(Math.random() * 100, 50));

  return <Skeleton h="23px" w={`${width.current}px`} />;
}
