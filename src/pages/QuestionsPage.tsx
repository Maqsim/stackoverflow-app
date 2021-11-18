import { useEffect, useState } from 'react';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import stackoverflow from '../uitls/stackexchange-api';
import { Box, Button, ButtonGroup, Flex, Stack } from '@chakra-ui/react';
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';

export function QuestionsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    stackoverflow
      .get('questions/unanswered/my-tags', {
        order: 'desc',
        sort: 'creation',
        pagesize: 15,
        filter: '!2lIeW85m7AP2q5(2DO8AHd8vNJAJ.OC6dwg0q)FyXc3)q)1FQtsWrOG)TSOfFUEhv.NB4.T(WdmCieWUDmUVbR0*'
      })
      .then((response) => {
        setQuestions((response as any).items);
        setIsLoaded(true);

        // TODO See if we can remove 300ms delay here
        // This is needed to show main window and close splash screen
        setTimeout(() => {
          window.Main.send('main-window-ready');
        }, 300);
      });
  }, []);

  return (
    <>
      <Flex justify="space-between" mb="16px">
        <ButtonGroup size="xs" isAttached variant="outline">
          <Button isActive mr="-px">
            Interesting
          </Button>
          <Button mr="-px">Bountied</Button>
          <Button>Hot</Button>
        </ButtonGroup>
      </Flex>

      <Stack spacing="8px">
        {/* Skeletons */}
        {!isLoaded && [...Array(10)].map((_, index) => <QuestionListItemSkeleton key={index} />)}

        {isLoaded && questions.map((question) => <QuestionListItem item={question} key={question.question_id} />)}
      </Stack>
    </>
  );
}
