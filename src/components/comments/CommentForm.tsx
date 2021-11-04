import { Box, HStack, Image, Input, Link } from '@chakra-ui/react';
import UserPlaceholder from '../../../assets/user-placeholder.jpeg';
import { useState } from 'react';

type Props = {
  olderCommentsCount?: number;
};

export function CommentForm({ olderCommentsCount }: Props) {
  const [view, setView] = useState<'form' | 'link'>('form');

  if (view === 'link') {
    return (
      <Link color="gray" fontSize="13px" h="24px" onClick={() => setView('form')}>
        Add a comment...
      </Link>
    );
  } else {
    return (
      <HStack align="flex-start" fontSize="13px">
        <Box flexBasis="40px" flexShrink={0}>
          <Image src={UserPlaceholder} boxSize="24px" objectFit="cover" borderRadius="3px" />
        </Box>
        <Box w="100%">
          <Input size="xs" placeholder="Your comment..." />
        </Box>
      </HStack>
    );
  }
}
