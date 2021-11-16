import { Box, HStack, SkeletonText } from '@chakra-ui/react';
import { VotingControls } from './VotingControls';
import { useRef } from 'react';
import randomRange from '../../uitls/random-range';

export function AnswerDetailsSkeleton() {
  const lineCount = useRef(randomRange(7, 12));

  return (
    <HStack spacing="12px" align="start">
      <VotingControls score={0} />

      <Box flexGrow={1}>
        <Box>
          <SkeletonText noOfLines={lineCount.current} spacing="12px" />
        </Box>
      </Box>
    </HStack>
  );
}
