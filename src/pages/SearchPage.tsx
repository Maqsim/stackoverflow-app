import { Heading, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import stackoverflow from '../uitls/stackexchange-api';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';
import { QuestionListItem } from '../components/posts/QuestionListItem';

export function SearchPage() {
  const query = useParams().query as string;
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    if (query) {
      search();
    }
  }, [query]);

  async function search() {
    setIsLoaded(false);

    const response: any = await stackoverflow.get(`search/advanced`, {
      order: 'desc',
      sort: 'relevance',
      filter: '!HzgO6Jg6sME4H_1lyzjHHRxMDyjoWkuK(8Xe125IMyd4rNGmzV(xVm79voQW*H7_CY)rZkEokE8LKn2_KZ4TJ5F0.2rZ1',
      q: query
    });

    setQuestions(response.items);
    setIsLoaded(true);
  }

  return (
    <>
      <Heading size="lg" mt="16px">
        Search results for "{query}"
      </Heading>

      <Stack spacing="8px" mt="16px">
        {/* Skeletons */}
        {!isLoaded && [...Array(10)].map((_, index) => <QuestionListItemSkeleton key={index} />)}

        {isLoaded && questions.map((question) => <QuestionListItem item={question} key={question.question_id} />)}
      </Stack>
    </>
  );
}
