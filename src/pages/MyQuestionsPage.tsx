import { useEffect, useState } from 'react';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItem } from '../components/QuestionListItem';
import { api } from '../unitls/stackexchange-api';
import { Stack } from '@chakra-ui/react';
import { QuestionListItemSkeleton } from '../components/QuestionListItem.skeleton';

export function MyQuestionsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    api('search/advanced', {
      user: '1453833',
      order: 'desc',
      sort: 'creation',
      filter: '!tf94YAq2Z_YBzNChvK*abKSyjEtOGYp'
    }).then((response) => {
      setQuestions((response as any).items);
      setIsLoaded(true);
    });
  }, []);

  return (
    <>
      <Stack spacing="8px">
        {/* Skeletons */}
        {!isLoaded && [...Array(10)].map((_, index) => <QuestionListItemSkeleton key={index} />)}

        {isLoaded && questions.map((question) => <QuestionListItem item={question} key={question.question_id} />)}
      </Stack>
    </>
  );
}
