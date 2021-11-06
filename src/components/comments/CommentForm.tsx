import { Box, Flex, HStack, Image, Input, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { useUser } from '../../contexts/use-user';

type Props = {
  hideControls?: boolean;
};

export function CommentForm({ hideControls }: Props) {
  const user = useUser();

  const [view, setView] = useState<'form' | 'link'>('form');
  console.log(hideControls);

  if (view === 'link') {
    return (
      <Link color="gray" fontSize="13px" h="24px" onClick={() => setView('form')}>
        Add a comment...
      </Link>
    );
  } else {
    return (
      <HStack align="flex-start" fontSize="13px">
        <Flex w={hideControls ? 'auto' : '66px'} flexShrink={0} justify="end">
          <Image src={user.data.profile_image} boxSize="24px" objectFit="cover" borderRadius="3px" />
        </Flex>
        <Box w="100%">
          <Input size="xs" placeholder="Your comment..." />
        </Box>
      </HStack>
    );
  }
}
