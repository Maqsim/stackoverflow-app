import { Box, Heading, HStack, Stack } from '@chakra-ui/react';
import parse from 'html-react-parser';
import { TagList } from './TagList';
import { UserBadge } from './UserBadge';
import { CommentListItem } from '../comments/CommentListItem';
import { CommentForm } from '../comments/CommentForm';
import { useState } from 'react';
import { VotingControls } from './VotingControls';
import parseBody from '../../unitls/parse-body';
import { QuestionType } from '../../interfaces/QuestionType';

type Props = {
  question: QuestionType;
};

export function QuestionDetails({ question }: Props) {
  const [score, setScore] = useState<number>(question.score);

  function handleUpvote() {
    setScore(score + 1);
  }

  function handleDownvote() {
    setScore(score - 1);
  }

  return (
    <HStack spacing="12px" align="start">
      <VotingControls score={score} onUpvote={handleUpvote} onDownvote={handleDownvote} />

      {/* overflow needed here to prevent child has more width than parent */}
      <Box flexGrow={1} overflow="auto" p="2px" m="-2px">
        <Heading size="md" mb="12px" maxWidth="800px">
          {parse(question.title)}
        </Heading>
        <Box className="stackoverflow_question-body" fontFamily="Georgia" fontSize="16px">
          {parseBody(question.body)}
        </Box>

        <HStack id="question-sticky-trigger" my="24px" justify="space-between" align="flex-start" fontSize="13px">
          <Box>
            <TagList tags={question.tags} />
          </Box>

          <UserBadge type="question" datetime={question.creation_date} user={question.owner} />
        </HStack>

        <Stack spacing="8px" borderTop="1px solid" borderColor="gray.200" pt="8px">
          {question.comment_count && question.comments.map((comment) => <CommentListItem comment={comment} key={comment.comment_id} />)}
          <CommentForm hideControls={!question.comment_count} />
        </Stack>
      </Box>
    </HStack>
  );
}
