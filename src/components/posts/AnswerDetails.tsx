import { Box, HStack, Link, Stack, Text } from '@chakra-ui/react';
import parse, { domToReact, Element } from 'html-react-parser';
import { Code } from './Code';
import { UserBadge } from './UserBadge';
import { CommentListItem } from '../comments/CommentListItem';
import { CommentForm } from '../comments/CommentForm';
import { Snippet } from './Snippet';
import type { AnswerType } from '../../interfaces/AnswerType';

type Props = {
  answer: AnswerType;
};

export function AnswerDetails({ answer }: Props) {
  return (
    <>
      <Box className="stackoverflow_question-body" fontFamily="Georgia" fontSize="16px">
        {parse(answer.body, {
          replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === 'code') {
              return <Code fontSize="13px">{domToReact(domNode.children)}</Code>;
            }

            if (domNode instanceof Element && domNode.name === 'pre') {
              return <Snippet>{domToReact(domNode.children)}</Snippet>;
            }
          }
        })}
      </Box>

      <HStack my="24px" justify="space-between" align="flex-start" fontSize="13px">
        <HStack>
          <Link color="gray" href="#">
            Share
          </Link>
          <Link color="gray" href="#">
            Edit
          </Link>
          <Link color="gray" href="#">
            Flag
          </Link>
        </HStack>

        <UserBadge type="answer" datetime={answer.creation_date} user={answer.owner} />
      </HStack>

      <Stack spacing="8px" borderTop="1px solid" borderColor="gray.200" pt="8px" ml="24px">
        {answer.comments?.map((comment) => (
          <CommentListItem comment={comment} key={comment.comment_id} />
        ))}
        <CommentForm />
      </Stack>
    </>
  );
}
