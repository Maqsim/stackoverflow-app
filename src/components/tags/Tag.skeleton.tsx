import { useRef } from 'react';
import randomRange from '../../uitls/random-range';
import { Skeleton } from '@chakra-ui/react';

export function TagSkeleton() {
  const width = useRef(randomRange(50, 100));

  return <Skeleton display="inline-flex" mr="4px" h="24px" w={`${width.current}px`} />;
}
