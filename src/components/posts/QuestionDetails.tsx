import { Box, Heading, HStack } from '@chakra-ui/react';
import parse from 'html-react-parser';
import { TagList } from '../tags/TagList';
import { PostProfileBadge } from '../profile/PostProfileBadge';
import { useState } from 'react';
import { VotingControls } from './VotingControls';
import parseBody from '../../uitls/parse-body';
import { QuestionType } from '../../interfaces/QuestionType';
import { CommentType } from '../../interfaces/CommentType';
import { CommentList } from '../comments/CommentList';
import { useUser } from '../../contexts/use-user';
import stackoverflow from '../../uitls/stackexchange-api';

type Props = {
  question: QuestionType;
};

export function QuestionDetails({ question }: Props) {
  const user = useUser();
  const [score, setScore] = useState<number>(question.score);
  const [isBookmarked, setIsBookmarked] = useState(question.favorited);
  const [bookmarkCount, setBookmarkCount] = useState(question.favorite_count);
  const [comments, setComments] = useState<CommentType[]>(question.comments || []);

  function handleUpvote() {
    setScore(score + 1);
  }

  function handleDownvote() {
    setScore(score - 1);
  }

  function handleToggleBookmark() {
    const oldValue = isBookmarked;
    const newValue = !isBookmarked;

    setIsBookmarked(newValue);
    setBookmarkCount(bookmarkCount + (oldValue ? -1 : 1));
    updateSidebarCount(newValue);
    requestToggleBookmark(newValue);
  }

  function handleCommentAdd(comment: CommentType) {
    setComments([...comments, comment]);
  }

  function updateSidebarCount(isBookmarked: boolean) {
    user.setSidebarCounts({ ...user.sidebarCounts, bookmarks: user.sidebarCounts.bookmarks + (isBookmarked ? 1 : -1) });
  }

  function requestToggleBookmark(value: boolean) {
    const url = value
      ? `questions/${question.question_id}/favorite`
      : `questions/${question.question_id}/favorite/undo`;

    stackoverflow.post(url, {});
  }

  return (
    <HStack spacing="12px" align="start">
      <VotingControls
        postType="question"
        isBookmarked={isBookmarked}
        bookmarkCount={bookmarkCount}
        score={score}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onToggleBookmark={handleToggleBookmark}
      />

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

          <PostProfileBadge type="question" datetime={question.creation_date} user={question.owner} />
        </HStack>

        <CommentList comments={comments} postId={question.question_id} onCommentAdd={handleCommentAdd} />
      </Box>
    </HStack>
  );
}
