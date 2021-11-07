import { useEffect, useRef, useState } from 'react';
import stackoverflow from '../unitls/stackexchange-api';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Button, ButtonGroup, Flex, Heading, HStack, Spinner, Stack, Text, Tooltip } from '@chakra-ui/react';
import { QuestionType } from '../interfaces/QuestionType';
import { BackButton } from '../components/layout/BackButton';
import { RiEarthFill, RiFileCopyFill } from 'react-icons/ri';
import { QuestionDetails } from '../components/posts/QuestionDetails';
import { AnswerDetails } from '../components/posts/AnswerDetails';
import { socketClient } from '../unitls/stackexchange-socket-client';
import { notification } from '../unitls/notitification';

let tooltipTimerId: NodeJS.Timer;

export function QuestionDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const initialQuestion = location.state as QuestionType;
  const [question, setQuestion] = useState(initialQuestion);
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

    socketClient.on(`1-question-${id}`, () => {
      notification('Question', 'questions changed');
    });

    return () => {
      socketClient.off(`1-question-${id}`);
    };
  }, [id]);

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

      {/*{question.answer_count > 0 ? (*/}
      {/*  <Box>*/}
      {/*    <Heading size="md" mb="32px" mt="48px" ref={answersRef}>*/}
      {/*      {question.answer_count} answers*/}
      {/*      <ButtonGroup size="xs" isAttached variant="outline" float="right">*/}
      {/*        <Button mr="-px" onClick={openInBrowser}>*/}
      {/*          Active*/}
      {/*        </Button>*/}
      {/*        <Button onClick={copyUrl}>Oldest</Button>*/}
      {/*        <Button onClick={copyUrl} isActive>*/}
      {/*          Votes*/}
      {/*        </Button>*/}
      {/*      </ButtonGroup>*/}
      {/*    </Heading>*/}

      {/*    <Stack spacing="48px">*/}
      {/*      {!isAnswersLoaded*/}
      {/*        ? [...Array(question.answer_count)].map((_, index) => <AnswerDetailsSkeleton key={index} />)*/}
      {/*        : answers.map((answer) => <AnswerDetails answer={answer} key={answer.answer_id} />)}*/}
      {/*    </Stack>*/}
      {/*  </Box>*/}
      {/*) : (*/}
      {/*  <Text mb="32px" color="gray" mt="48px" textAlign="center" ref={answersRef}>*/}
      {/*    There are no answers yet.*/}
      {/*  </Text>*/}
      {/*)}*/}

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