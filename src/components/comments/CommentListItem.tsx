import { Box, HStack, Image, Text } from '@chakra-ui/react';
import { CommentType } from '../../interfaces/CommentType';
import parse, { domToReact, Element } from 'html-react-parser';
import { Code } from "../posts/Code";

type Props = {
  comment: CommentType;
};

export function CommentListItem({ comment }: Props) {
  return (
    <HStack align="flex-start" fontSize="13px">
      <Box flexBasis="40px" flexShrink={0}>
        <Image src={comment.owner.profile_image} boxSize="24px" objectFit="cover" borderRadius="3px" />
      </Box>
      <Text alignSelf="center">
        {parse(comment.body, {
          replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === 'code') {
              return <Code fontSize="13px">{domToReact(domNode.children)}</Code>;
            }
          }
        })}
      </Text>
    </HStack>
  );
}
