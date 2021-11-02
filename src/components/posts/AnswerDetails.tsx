import { Box, HStack, Stack } from '@chakra-ui/react';
import { UserBadge } from './UserBadge';
import { CommentListItem } from '../comments/CommentListItem';
import { CommentForm } from '../comments/CommentForm';
import type { AnswerType } from '../../interfaces/AnswerType';
import { VotingControls } from './VotingControls';
import parseBody from '../../unitls/parse-body';

type Props = {
  answer: AnswerType;
};

export function AnswerDetails({ answer }: Props) {
  return (
    <HStack spacing="12px" align="start">
      <VotingControls score={answer.score} />

      {/* overflow needed here to prevent child has more width than parent */}
      <Box overflow="auto">
        <Box className="stackoverflow_question-body" fontFamily="Georgia" fontSize="16px">
          {parseBody(answer.body)}{' '}
        </Box>

        <HStack my="24px" align="flex-start" justify="end">
          <UserBadge type="answer" datetime={answer.creation_date} user={answer.owner} />
        </HStack>

        <Stack spacing="8px" borderTop="1px solid" borderColor="gray.200" pt="8px">
          {answer.comments?.map((comment) => (
            <CommentListItem comment={comment} key={comment.comment_id} />
          ))}
          <CommentForm />
        </Stack>
      </Box>
    </HStack>
  );
}
