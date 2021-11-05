import { useEffect, useRef, useState } from 'react';
import stackoverflow from '../unitls/stackexchange-api';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Button, ButtonGroup, Flex, Heading, HStack, Spinner, Stack, Text, Tooltip } from '@chakra-ui/react';
import { QuestionDetailsType } from '../interfaces/QuestionDetailsType';
import { QuestionType } from '../interfaces/QuestionType';
import { BackButton } from '../components/layout/BackButton';
import { RiEarthFill, RiFileCopyFill } from 'react-icons/ri';
import { QuestionDetails } from '../components/posts/QuestionDetails';
import { AnswerDetails } from '../components/posts/AnswerDetails';
import { AnswerType } from '../interfaces/AnswerType';
import { StickyAnswerForm } from '../components/posts/StickyAnswerForm';
import { socketClient } from '../unitls/stackexchange-socket-client';

let tooltipTimerId: NodeJS.Timer;

export function QuestionDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const initialQuestion = location.state as QuestionType;
  const [question, setQuestion] = useState<QuestionDetailsType>(initialQuestion as QuestionDetailsType);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [isTooltipShown, setIsTooltipShown] = useState(false);
  const answersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!question) {
      stackoverflow
        .get(`questions/${id}`, {
          filter: '!T1gn2_Z7sHTWd5)zc*'
        })
        .then((response) => {
          setQuestion((response as any).items[0]);
        });
    }
    stackoverflow
      .get(`questions/${id}/answers`, {
        filter: '!2uJf83FMV*M-dzLI3KWSqhEXA*t9s7t6IYVsbULsbn'
      })
      .then((response) => {
        setAnswers((response as any).items);
      });

    socketClient.on(`1-question-${id}`, () => {
      new Notification('Question', { body: 'questions changed' });
    });

    return () => {
      socketClient.off(`1-question-${id}`);
    };
  }, []);

  function jumpToAnswers() {
    answersRef.current?.scrollIntoView({ block: 'center' });
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
      <Flex justify="space-between" position="sticky" top="-16px" p="16px" m="-16px" mb="16px" bgColor="white" zIndex={100}>
        <BackButton />

        <HStack spacing="16px">
          <Button size="xs" variant="outline" onClick={jumpToAnswers}>
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

      <QuestionDetails question={question} />

      {answers.length ? (
        <Box>
          <Heading size="md" mb="32px" mt="48px" ref={answersRef}>
            {answers.length} answers
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
            {answers.map((answer) => (
              <AnswerDetails answer={answer} key={answer.answer_id} />
            ))}
          </Stack>
        </Box>
      ) : (
        <Text mb="32px" color="gray" mt="48px" textAlign="center" ref={answersRef}>
          There are no answers yet.
        </Text>
      )}

      <StickyAnswerForm />
    </>
  );
}
