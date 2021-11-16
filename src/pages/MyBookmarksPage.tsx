import { useEffect, useState } from 'react';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import stackoverflow from '../uitls/stackexchange-api';
import { Stack } from '@chakra-ui/react';
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';

export function MyBookmarksPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    stackoverflow
      .get('me/favorites', {
        order: 'desc',
        sort: 'creation',
        filter: '!2lIeW85m7AP2q5(2DO8AHd8vNJAJ.OC6dwg0q)FyXc3)q)1FQtsWrOG)TSOfFUEhv.NB4.T(WdmCieWUDmUVbR0*'
      })
      .then((response) => {
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
