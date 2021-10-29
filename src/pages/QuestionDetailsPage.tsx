import { useEffect, useState } from 'react';
import { api } from '../unitls/stackexchange-api';
import { useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  Link,
  Spinner, Stack,
  Tooltip
} from "@chakra-ui/react";
import { QuestionDetailsType } from '../interfaces/QuestionDetailsType';
import { QuestionType } from '../interfaces/QuestionType';
import parse, { domToReact, Element } from 'html-react-parser';
import { BackButton } from '../components/BackButton';
import { RiBallPenFill, RiEarthFill, RiFileCopyFill } from 'react-icons/ri';
import { Code } from '../components/Code';
import { CommentListItem } from '../components/comments/CommentListItem';
import { UserBadge } from '../components/UserBadge';
import { TagList } from '../components/TagList';
import type { CommentType } from '../interfaces/CommentType';
import { CommentForm } from "../components/comments/CommentForm";
import { InlineCode } from "../components/InlineCode";

let tooltipTimerId: NodeJS.Timer;

export function QuestionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const initialQuestion = location.state as QuestionType;
  const [question, setQuestion] = useState<QuestionDetailsType>(
    initialQuestion as QuestionDetailsType
  );
  const [comments, setComments] = useState<CommentType[]>();
  const [isTooltipShown, setIsTooltipShown] = useState(false);

  useEffect(() => {
    if (!question) {
      api(`questions/${id}`, {
        filter: '!T1gn2_Z7sHTWd5)zc*'
      }).then((response) => {
        setQuestion((response as any).items[0]);
      });
    }

    api(`questions/${id}/comments`, {
      order: 'asc',
      sort: 'creation',
      filter: '!1zI5*cxyWVN7GRZNZpt2O'
    }).then((response) => {
      setComments((response as any).items);
    });
  }, []);

  function openInBrowser() {
    window.open(question.link);
  }

  function copyUrl() {
    clearTimeout(tooltipTimerId);

    setIsTooltipShown(true);
    window.Main.copyToClipboard(question.link);

    tooltipTimerId = setTimeout(() => {
      setIsTooltipShown(false);
    }, 2000);
  }

  if (!question) {
    return <Spinner />;
  }

  return (
    <Box>
      <Flex mb="32px" justify="space-between">
        <BackButton />

        <HStack spacing="16px">
          <Button size="xs" variant="outline">
            Jump to answers
          </Button>

          <ButtonGroup size="xs" isAttached variant="outline">
            <Button mr="-px" onClick={openInBrowser} leftIcon={<RiEarthFill />} iconSpacing="3px">
              Open in browser
            </Button>
            <Tooltip label="Copied!" isOpen={isTooltipShown}>
              <Button onClick={copyUrl} leftIcon={<RiFileCopyFill />} iconSpacing="3px">
                Copy URL
              </Button>
            </Tooltip>
          </ButtonGroup>
        </HStack>
      </Flex>

      <Heading size="md" mb="12px">
        {parse(question.title)}
      </Heading>
      <Box className="stackoverflow_question-body">
        {parse(question.body, {
          replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === 'code') {
              return <InlineCode fontSize="13px">{domToReact(domNode.children)}</InlineCode>;
            }

            if (domNode instanceof Element && domNode.name === 'pre') {
              return <Code>{domToReact(domNode.children)}</Code>;
            }
          }
        })}
      </Box>

      <Box mt="24px">
        <TagList tags={question.tags} />
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

        <UserBadge />
      </HStack>

      <Stack spacing="8px" borderTop="1px solid" borderColor="gray.200" pt="8px" ml="24px">
        {comments?.map((comment) => (
          <CommentListItem comment={comment} key={`${question.question_id}-${comment.comment_id}`} />
        ))}
        <CommentForm />
      </Stack>

      <Box>
        <Heading size="md" my="32px">Answers</Heading>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi doloremque fugit nulla optio praesentium! Ab animi cupiditate delectus hic illo incidunt modi nisi non nostrum omnis quidem, quisquam rem veritatis.
      </Box>
    </Box>
  );
}
