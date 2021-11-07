import { Flex, HStack, Skeleton } from '@chakra-ui/react';
import { useRef } from 'react';
import randomRange from '../../unitls/random-range';

export function CommentListItemSkeleton() {
  const commentWidth = useRef(randomRange(40, 100));

  return (
    <HStack align="center" fontSize="13px">
      <Flex w="66px" flexShrink={0} justify="end">
        <Skeleton boxSize="24px" />
      </Flex>
      <Flex w="100%">
        <Skeleton w={`${commentWidth.current}%`} h="14px" />
      </Flex>
    </HStack>
  );
}
