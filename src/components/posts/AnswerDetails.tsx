import { Box, HStack } from '@chakra-ui/react';
import { PostProfileBadge } from '../profile/PostProfileBadge';
import type { AnswerType } from '../../interfaces/AnswerType';
import { VotingControls } from './VotingControls';
import parseBody from '../../uitls/parse-body';
import { useState } from 'react';
import { CommentType } from '../../interfaces/CommentType';
import { CommentList } from '../comments/CommentList';

type Props = {
  answer: AnswerType;
};

export function AnswerDetails({ answer }: Props) {
  const [score, setScore] = useState<number>(answer.score);
  const [comments, setComments] = useState<CommentType[]>(answer.comments || []);

  function handleUpvote() {
    setScore(score + 1);
  }

  function handleDownvote() {
    setScore(score - 1);
  }

  function handleCommentAdd(comment: CommentType) {
    setComments([...comments, comment]);
  }

  return (
    <HStack spacing="12px" align="start">
      <VotingControls
        postType="answer"
        isAccepted={answer.is_accepted}
        score={score}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
      />

      {/* overflow needed here to prevent child has more width than parent */}
      <Box flexGrow={1} overflow="auto" p="2px" m="-2px">
        <Box className="stackoverflow_question-body" fontFamily="Georgia" fontSize="16px">
          {parseBody(answer.body)}
        </Box>

        <HStack my="24px" align="flex-start" justify="end">
          <PostProfileBadge type="answer" datetime={answer.creation_date} user={answer.owner} />
        </HStack>

        <CommentList comments={comments} postId={answer.answer_id} onCommentAdd={handleCommentAdd} />
      </Box>
    </HStack>
  );
}
