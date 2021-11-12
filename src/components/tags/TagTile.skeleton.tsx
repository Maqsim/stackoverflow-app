import { Box, HStack, Skeleton, SkeletonText } from '@chakra-ui/react';
import { TagSkeleton } from './Tag.skeleton';

export function TagTileSkeleton() {
  return (
    <Box border="1px solid" borderColor="gray.200" p="8px" rounded="5px">
      <TagSkeleton />

      <SkeletonText noOfLines={3} my="17px" />

      <HStack mt="8px">
        <Skeleton h="24px" flex={1} />
        <Skeleton h="24px" flex={1} />
      </HStack>
    </Box>
  );
}
