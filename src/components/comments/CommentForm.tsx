import { Box, Flex, HStack, Image, Input } from '@chakra-ui/react';
import { useUser } from '../../contexts/use-user';

type Props = {
  hideControls?: boolean;
};

export function CommentForm({ hideControls }: Props) {
  const user = useUser();

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
