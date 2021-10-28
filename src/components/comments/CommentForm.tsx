import { Box, HStack, Image, Input } from '@chakra-ui/react';
import { CommentType } from '../../interfaces/CommentType';
import UserPlaceholder from '../../../assets/user-placeholder.jpeg';

type Props = {
  comment: CommentType;
};

export function CommentForm() {
  return (
    <HStack align="flex-start" fontSize="12px">
      <Box flexBasis="40px" flexShrink={0}>
        <Image src={UserPlaceholder} boxSize="24px" objectFit="cover" borderRadius="3px" />
      </Box>
      <Box flexGrow={1}>
        <Input size="xs" placeholder="Your comment..." />
      </Box>
    </HStack>
  );
}
