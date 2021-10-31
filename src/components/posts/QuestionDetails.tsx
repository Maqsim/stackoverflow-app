import { Box, Heading, HStack, Link, Stack, Text } from '@chakra-ui/react';
import parse, { domToReact, Element } from 'html-react-parser';
import { Code } from './Code';
import { TagList } from './TagList';
import { UserBadge } from './UserBadge';
import { CommentListItem } from '../comments/CommentListItem';
import { CommentForm } from '../comments/CommentForm';
import { QuestionDetailsType } from '../../interfaces/QuestionDetailsType';
import stackoverflow from '../../unitls/stackexchange-api';
import { useEffect, useState } from 'react';
import { CommentType } from '../../interfaces/CommentType';
import { Snippet } from './Snippet';

type Props = {
  question: QuestionDetailsType;
};

export function QuestionDetails({ question }: Props) {
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    stackoverflow
      .get(`questions/${question.question_id}/comments`, {
        order: 'asc',
        sort: 'creation',
        filter: '!1zI5*cxyWVN7GRZNZpt2O'
      })
      .then((response) => {
        setComments((response as any).items);
        setIsCommentsLoading(false);
      });
  }, []);

  return (
    <>
      <Heading size="md" mb="12px">
        {parse(question.title)}
      </Heading>
      <Box className="stackoverflow_question-body" fontFamily="Georgia" fontSize="16px">
        {parse(question.body, {
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

      <Box mt="24px">
        <TagList tags={question.tags} />
      </Box>

      <HStack id="question-sticky-trigger" my="24px" justify="space-between" align="flex-start" fontSize="13px">
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

        <UserBadge type="question" datetime={question.creation_date} user={question.owner} />
      </HStack>

      {!isCommentsLoading && (
        <Stack spacing="8px" borderTop="1px solid" borderColor="gray.200" pt="8px" ml="24px">
          {comments.map((comment) => (
            <CommentListItem comment={comment} key={comment.comment_id} />
          ))}
          <CommentForm olderCommentsCount={comments.length} />
        </Stack>
      )}
    </>
  );
}
