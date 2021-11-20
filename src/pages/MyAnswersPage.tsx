import { useEffect, useState } from 'react';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import stackoverflow from '../uitls/stackexchange-api';
import { Stack } from '@chakra-ui/react';
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';
import { AnswerType } from '../interfaces/AnswerType';

export function MyAnswersPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    (async () => {
      const questionIds = await getAnswersQuestionIds();

      const response: any = await stackoverflow.get(`questions/${questionIds.join(';')}`, {
        order: 'desc',
        sort: 'creation',
        filter: '!2lIeW85m7AP2q5(2DO8AHd8vNJAJ.OC6dwg0q)FyXc3)q)1FQtsWrOG)TSOfFUEhv.NB4.T(WdmCieWUDmUVbR0*'
      });

      setQuestions(response.items);
      setIsLoaded(true);
    })();
  }, []);

  function getAnswersQuestionIds() {
    return stackoverflow
      .get('me/answers', {
        order: 'desc',
        limit: 15,
        sort: 'creation',
        filter: '!AH)b5JZk)e5p'
      })
      .then((response) => (response as any).items.map((answer: AnswerType) => answer.question_id));
  }

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
