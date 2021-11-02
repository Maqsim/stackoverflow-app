import { useEffect, useState } from 'react';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import stackoverflow from '../unitls/stackexchange-api';
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
        filter: '!tf94YAq2Z_YBzNChvK*abKSyjEtOGYp'
      })
      .then((response) => {
        setQuestions((response as any).items);
        setIsLoaded(true);
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
