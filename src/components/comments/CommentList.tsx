import { CommentListItem } from './CommentListItem';
import { CommentForm } from './CommentForm';
import { Box, Button, Stack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useUser } from '../../contexts/use-user';
import { FeaturesEnum } from '../../interfaces/FeaturesEnum';
import { CommentType } from '../../models/comment-store/comment';

type Props = {
  postId: number;
  comments: CommentType[];
  onAdd: (comment: CommentType) => void;
  onUpvote: (comment: CommentType) => void;
};

const LIMIT_INCREASE = 5;

export function CommentList({ postId, comments, onAdd, onUpvote }: Props) {
  const user = useUser();
  const [limit, setLimit] = useState<number | undefined>(LIMIT_INCREASE);
  const shownComments = comments.slice(0, limit);
  const isCommentingEnabled = useMemo(() => user.isFeatureOn(FeaturesEnum.COMMENT), []);

  function handleCommentAdd(comment: CommentType) {
    setLimit(undefined);

    onAdd(comment);
  }

  return (
    <Stack spacing="8px" borderTop="1px solid" borderColor="gray.200" pt="8px">
      {/* List */}
      {shownComments?.map((comment) => (
        <CommentListItem comment={comment} onUpvote={() => onUpvote(comment)} key={comment.comment_id} />
      ))}

      {/* Show more button */}
      {comments.length !== shownComments.length && (
        <Box pl="74px">
          <Button size="xs" onClick={() => setLimit(typeof limit === 'number' ? limit + LIMIT_INCREASE : undefined)}>
            Show more {Math.min(comments.length - shownComments.length, LIMIT_INCREASE)} comments
          </Button>
        </Box>
      )}

      {/* Form */}
      {isCommentingEnabled && (
        <CommentForm postId={postId} onCommentAdd={handleCommentAdd} hideControls={!comments?.length} />
      )}
    </Stack>
  );
}
