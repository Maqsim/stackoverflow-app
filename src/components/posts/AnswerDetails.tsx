import { Box, HStack, useToast } from '@chakra-ui/react';
import { PostProfileBadge } from '../profile/PostProfileBadge';
import type { AnswerType } from '../../interfaces/AnswerType';
import { VotingControls } from './VotingControls';
import parseBody from '../../uitls/parse-body';
import { useState } from 'react';
import { CommentType } from '../../interfaces/CommentType';
import { CommentList } from '../comments/CommentList';
import { clone } from 'lodash';
import stackoverflow from '../../uitls/stackexchange-api';
import { promiser } from '../../uitls/promiser';
import { ResponseType } from '../../interfaces/Response';
import { decodeEntity } from '../../uitls/decode-entities';

type Props = {
  answer: AnswerType;
};

export function AnswerDetails({ answer }: Props) {
  const toast = useToast();
  const [score, setScore] = useState<number>(answer.score);
  const [comments, setComments] = useState<CommentType[]>(answer.comments || []);

  function handleUpvote() {
    setScore(score + 1);
  }

  async function handleCommentUpvote(comment: CommentType) {
    const oldComment = clone(comment);
    const action = comment.upvoted ? 'upvote/undo' : 'upvote';

    // Optimistic UI
    updateComment(
      comment,
      comment.upvoted ? { score: comment.score - 1, upvoted: false } : { score: comment.score + 1, upvoted: true }
    );

    // Pessimistic UI
    const [response, error] = await promiser<ResponseType<CommentType>>(
      stackoverflow.post(`comments/${comment.comment_id}/${action}`)
    );

    updateComment(comment, error ? oldComment : response.items[0]);

    if (error?.data?.error_message) {
      toast({
        position: 'top',
        description: decodeEntity(error.data.error_message),
        status: 'error',
        duration: 3000
      });
    }
  }

  function updateComment(comment: CommentType, data: Partial<CommentType> = {}) {
    const _comments = clone(comments);
    const foundComment = _comments.find((c) => c.comment_id === comment.comment_id) as CommentType;
    Object.assign(foundComment, data);

    setComments(_comments);
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

        <CommentList
          comments={comments}
          postId={answer.answer_id}
          onAdd={handleCommentAdd}
          onUpvote={handleCommentUpvote}
        />
      </Box>
    </HStack>
  );
}
