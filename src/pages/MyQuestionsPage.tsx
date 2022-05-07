import { useEffect, useState } from 'react';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import stackoverflow from '../uitls/stackexchange-api';
import { Box, Center, Stack } from "@chakra-ui/react";
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';
import { Pagination } from '../components/ui/Pagination';
import { usePagination } from '../hooks/use-pagination';

export function MyQuestionsPage() {
  const pagination = usePagination();
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    stackoverflow
      .get('me/questions', {
        order: 'desc',
        sort: 'creation',
        page: pagination.page,
        pagesize: pagination.perPage,
        filter: '!HzgO6Jg6sME4H_1lyzjHHRxMDyjoWkuK(8Xe125IMyd4rNGmzV(xVm79voQW*H7_CY)rZkEokE8LKn2_KZ4TJ5F0.2rZ1'
      })
      .then((response) => {
        pagination.setTotal((response as any).total);
        setQuestions((response as any).items);
        setIsLoaded(true);
      });
  }, [pagination.page, pagination.perPage]);

  if (isLoaded && !questions.length) {
    return (
      <Center color="gray.500" height="200px">
        You have no any questions yet.
      </Center>
    );
  }

  return (
    <>
      <Stack spacing="8px">
        {/* Skeletons */}
        {!isLoaded && [...Array(10)].map((_, index) => <QuestionListItemSkeleton key={index} />)}

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
