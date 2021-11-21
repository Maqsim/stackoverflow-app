import { useEffect, useState } from 'react';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import stackoverflow from '../uitls/stackexchange-api';
import { Stack } from '@chakra-ui/react';
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';

export function MyQuestionsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    stackoverflow
      .get('me/questions', {
        order: 'desc',
        sort: 'creation',
        filter: '!)aHQ9FGlxVZ-FDR26-WVaCfTrj.jxW4cWReTQd3t1kBINL)p.fWrud_U3N_t2YjQQ5EjD.hcISk2Lm5)H)jkebfvg)D'
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
