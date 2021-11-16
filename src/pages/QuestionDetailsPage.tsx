import { useEffect, useRef, useState } from 'react';
import stackoverflow from '../uitls/stackexchange-api';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Button, ButtonGroup, Flex, Heading, HStack, Spinner, Stack, Text, Tooltip } from '@chakra-ui/react';
import { QuestionType } from '../interfaces/QuestionType';
import { BackButton } from '../components/layout/BackButton';
import { RiEarthFill, RiFileCopyFill } from 'react-icons/ri';
import { QuestionDetails } from '../components/posts/QuestionDetails';
import { AnswerDetails } from '../components/posts/AnswerDetails';
import { socketClient } from '../uitls/stackexchange-socket-client';
import { notification } from '../uitls/notitification';
import { getItem, setItem } from '../uitls/local-storage';

let tooltipTimerId: NodeJS.Timer;

export function QuestionDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const initialQuestion = location.state as QuestionType;
  const [question, setQuestion] = useState(initialQuestion);
  const [isTooltipShown, setIsTooltipShown] = useState(false);
  const answersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    // Remember visited question
    const visitedQuestionIds = (getItem('visited-question-ids') as number[]) || [];
    if (!visitedQuestionIds.includes(parseInt(id, 10))) {
      visitedQuestionIds.push(parseInt(id, 10));
      setItem('visited-question-ids', visitedQuestionIds);
    }

    if (!question) {
      stackoverflow
        .get(`questions/${id}`, {
          filter: '!9MyMg2qFPpNbuLMPVtF3UyZX-N4MWSjZwlQ(VqCZ3LoiM_GpZITfZz5'
        })
        .then((response) => {
          setQuestion((response as any).items[0]);
        });
    }

    socketClient.on(`1-question-${id}`, () => {
      notification('Question', 'questions changed');
    });

    return () => {
      socketClient.off(`1-question-${id}`);
    };
  }, [id]);

  function jumpToAnswers() {
    const scrollableEl = document.getElementById('scrolling-container');

    answersRef.current?.scrollIntoView({ block: 'start' });
    scrollableEl?.scrollBy(0, -60);
  }

  function openInBrowser() {
    window.location.href = question.link;
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
    <>
      <Flex
        justify="space-between"
        position="sticky"
        top="-16px"
        p="16px"
        m="-16px"
        mb="16px"
        bgColor="white"
        zIndex={100}
      >
        <BackButton />

        <HStack spacing="16px">
          {question.answer_count > 0 && (
            <Button size="xs" variant="outline" onClick={jumpToAnswers}>
              Jump to answers
            </Button>
          )}

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

      <QuestionDetails question={question} />

      {question.answer_count > 0 ? (
        <Box>
          <Heading size="md" mb="32px" mt="48px" ref={answersRef}>
            {question.answer_count} answers
            <ButtonGroup size="xs" isAttached variant="outline" float="right">
              <Button mr="-px" onClick={openInBrowser}>
                Active
              </Button>
              <Button onClick={copyUrl}>Oldest</Button>
              <Button onClick={copyUrl} isActive>
                Votes
              </Button>
            </ButtonGroup>
          </Heading>

          <Stack spacing="48px">
            {question.answers.map((answer) => (
              <AnswerDetails answer={answer} key={answer.answer_id} />
            ))}
          </Stack>
        </Box>
      ) : (
        <Text mb="32px" color="gray" mt="48px" textAlign="center" ref={answersRef}>
          There are no answers yet.
        </Text>
      )}

      {/*<StickyAnswerForm />*/}
    </>
  );
}
