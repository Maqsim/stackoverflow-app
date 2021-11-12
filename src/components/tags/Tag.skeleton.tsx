import { useRef } from 'react';
import randomRange from '../../unitls/random-range';
import { Skeleton } from '@chakra-ui/react';

export function TagSkeleton() {
  const width = useRef(randomRange(50, 100));

  return <Skeleton h="23px" w={`${width.current}px`} />;
}
