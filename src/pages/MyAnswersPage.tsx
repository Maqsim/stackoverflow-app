import { useEffect, useState } from 'react';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import stackoverflow from '../uitls/stackexchange-api';
import { Box, Center, Stack, Text } from "@chakra-ui/react";
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';
import { AnswerType } from '../interfaces/AnswerType';
import { Pagination } from '../components/ui/Pagination';
import { usePagination } from '../hooks/use-pagination';
import { GoTriangleUp } from "react-icons/go";

export function MyAnswersPage() {
  const pagination = usePagination();
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoaded(false);

      const questionIds = await getAnswersQuestionIds(pagination.page, pagination.perPage);

      if (questionIds.length === 0) {
        setIsLoaded(true);
        return;
      }

      const response: any = await stackoverflow.get(`questions/${questionIds.join(';')}`, {
        order: 'desc',
        sort: 'creation',
        filter: '!HzgO6Jg6sME4H_1lyzjHHRxMDpvUVz34FqU_ckIV0XzN3qEw_80oXIpo62fBS4o8q9Wa31mkyd5kX4GFMvlXoA)k1AlLP'
      });

      setQuestions(response.items);
      setIsLoaded(true);
    })();
  }, [pagination.page, pagination.perPage]);

  function getAnswersQuestionIds(page: number, perPage: number) {
    return stackoverflow
      .get('me/answers', {
        order: 'desc',
        sort: 'creation',
        page,
        pagesize: perPage,
        filter: '!AH)b5JZk)e5p'
      })
      .then((response: any) => {
        pagination.setTotal(response.total);

        return response.items.map((answer: AnswerType) => answer.question_id);
      });
  }

  if (isLoaded && !questions.length) {
    return (
      <Center color="gray.500" height="200px">
        You have no any answers yet.
      </Center>
    );
  }

  return (
    <>
      <Stack spacing="8px">
        {/* Skeletons */}
        {!isLoaded && [...Array(pagination.perPage)].map((_, index) => <QuestionListItemSkeleton key={index} />)}

        {isLoaded && questions.map((question) => <QuestionListItem item={question} key={question.question_id} />)}
      </Stack>

      {pagination.totalPages > 0 && (
        <Box my="16px">
          <Pagination controller={pagination} />
        </Box>
      )}
    </>
  );
}
