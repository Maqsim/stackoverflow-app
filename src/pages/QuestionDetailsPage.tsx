import { useEffect, useRef, useState } from 'react';
import stackoverflow from '../uitls/stackexchange-api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, ButtonGroup, Flex, Heading, HStack, Stack, Text, Tooltip } from '@chakra-ui/react';
import { QuestionType } from '../interfaces/QuestionType';
import { BackButton } from '../components/layout/BackButton';
import { RiEarthFill, RiFileCopyFill } from 'react-icons/ri';
import { QuestionDetails } from '../components/posts/QuestionDetails';
import { AnswerDetails } from '../components/posts/AnswerDetails';
import { socketClient } from '../uitls/stackexchange-socket-client';
import { getItem, setItem } from '../uitls/local-storage';
import { AppSpinner } from '../components/layout/AppSpinner';
import { StickyAnswerForm } from '../components/posts/StickyAnswerForm';
import { AnswerType } from '../interfaces/AnswerType';
import { clone } from 'lodash';

let tooltipTimerId: NodeJS.Timer;

export function QuestionDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const initialQuestion: QuestionType | undefined = location.state && location.state.question;
  const postType: 'answer' | 'question' = (location.state && location.state.postType) || 'question';
  const [question, setQuestion] = useState(initialQuestion);
  const [isTooltipShown, setIsTooltipShown] = useState(false);
  const [isLoaded, setIsLoaded] = useState(Boolean(question));
  const answersRef = useRef<HTMLDivElement>(null);

  // If answer, obtain questionId and reload
  useEffect(() => {
    if (!id || postType !== 'answer') {
      return;
    }

    setIsLoaded(false);
    (async () => {
      const questionId = ((await stackoverflow.get(`answers/${id}`, { filter: '!-)QWsbcLyRoQ' })) as any).items[0]
        .question_id;

      navigate(`/questions/${questionId}`, { replace: true });
    })();
  }, [id, postType]);

  useEffect(() => {
    if (!id || postType !== 'question') {
      return;
    }

    // Remember visited question
    const visitedQuestionIds = (getItem('visited-question-ids') as number[]) || [];
    if (!visitedQuestionIds.includes(parseInt(id, 10))) {
      visitedQuestionIds.push(parseInt(id, 10));
      setItem('visited-question-ids', visitedQuestionIds);
    }

    if (!question || question.question_id !== parseInt(id)) {
      setIsLoaded(false);

      getQuestionById(id).then((question) => {
        setQuestion(question);
        setIsLoaded(true);
      });
    }

    if (question) {
      socketClient.on(`1-question-${id}`, (data: any) => {
        const isQuestionUpdating = data.id === question.question_id;

        // TODO parse action
        // TODO listen for more actions
        switch (data.a) {
          case 'score': // Score changed
            if (isQuestionUpdating) {
              setTimeout(async () => {
                const updatedQuestion = await getQuestionById(id);

                setQuestion({
                  ...question,
                  score: data.score,
                  upvoted: updatedQuestion.upvoted,
                  downvoted: updatedQuestion.downvoted
                });
              }, 500);
            } else {
              const _question = clone(question);
              const answer = _question.answers.find((a) => a.answer_id === data.id);

              if (answer) {
                answer.score = data.score;
                setQuestion(_question);
              }
            }
            break;
        }

        console.log('Question', 'questions changed', data);
      });
    }

    return () => {
      socketClient.off(`1-question-${id}`);
    };
  }, [id, postType]);

  function getQuestionById(id: string) {
    return stackoverflow
      .get(`questions/${id}`, {
        filter: '!9MyMg2qFPpNbuLMPVtF3UyZX-N4MWSjZwlQ(VqCZ)UMRPTuNScvYNba'
      })
      .then((response) => (response as any).items[0]);
  }

  function jumpToAnswers() {
    const scrollableEl = document.getElementById('scrolling-container');

    answersRef.current?.scrollIntoView({ block: 'start' });
    scrollableEl?.scrollBy(0, -60);
  }

  function openInBrowser() {
    if (!question) {
      return;
    }

    window.location.href = question.link;
  }

  function copyUrl() {
    if (!question) {
      return;
    }

    clearTimeout(tooltipTimerId);

    setIsTooltipShown(true);
    window.Main.copyToClipboard(question.link);

    tooltipTimerId = setTimeout(() => {
      setIsTooltipShown(false);
    }, 2000);
  }

  function handleAnswerAdd(answer: AnswerType) {
    const _question: QuestionType = clone(question!);

    if (!_question?.answers) {
      _question!.answers = [];
    }

    _question!.answers.push(answer);
    _question!.answer_count++;

    setQuestion(_question);
  }

  if (!isLoaded || !question) {
    return <AppSpinner />;
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
        zIndex={1}
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

      <StickyAnswerForm questionId={question.question_id} onSuccess={handleAnswerAdd} />
    </>
  );
}
