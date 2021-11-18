import { Box, Heading, HStack } from '@chakra-ui/react';
import parse from 'html-react-parser';
import { TagList } from '../tags/TagList';
import { ProfileBadge } from '../profile/ProfileBadge';
import { useState } from 'react';
import { VotingControls } from './VotingControls';
import parseBody from '../../uitls/parse-body';
import { QuestionType } from '../../interfaces/QuestionType';
import { CommentType } from '../../interfaces/CommentType';
import { CommentList } from '../comments/CommentList';

type Props = {
  question: QuestionType;
};

export function QuestionDetails({ question }: Props) {
  const [score, setScore] = useState<number>(question.score);
  const [comments, setComments] = useState<CommentType[]>(question.comments || []);

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

          <ProfileBadge type="question" datetime={question.creation_date} user={question.owner} />
        </HStack>

        <CommentList comments={comments} postId={question.question_id} onCommentAdd={handleCommentAdd} />
      </Box>
    </HStack>
  );
}
