import { Box, HStack, Image, Text } from '@chakra-ui/react';
import { CommentType } from '../../interfaces/CommentType';
import parse from 'html-react-parser';

type Props = {
  comment: CommentType;
};

export function CommentListItem({ comment }: Props) {
  return (
    <HStack align="flex-start" fontSize="12px">
      <Box flexBasis="40px" flexShrink={0}>
        <Image
          src={comment.owner.profile_image}
          boxSize="24px"
          objectFit="cover"
          borderRadius="3px"
        />
      </Box>
      <Text alignSelf="center">{parse(comment.body)}</Text>
    </HStack>
  );
}
