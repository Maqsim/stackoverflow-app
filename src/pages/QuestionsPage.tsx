import { useEffect, useState } from 'react';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import stackoverflow from '../uitls/stackexchange-api';
import { Box, Button, ButtonGroup, Flex, Stack } from '@chakra-ui/react';
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';
import { usePagination } from '../hooks/use-pagination';
import { Pagination } from '../components/ui/Pagination';

export function QuestionsPage() {
  const pagination = usePagination();
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    setIsLoaded(false);

    stackoverflow
      .get('questions/unanswered/my-tags', {
        order: 'desc',
        sort: 'creation',
        page: pagination.page,
        pagesize: pagination.perPage,
        filter: '!HzgO6Jg6sME4H_1lyzjHHRxMDpvUVz34FqU_ckIV0XzN3qEw_80oXIpo62fBS4o8q9Wa31mkyd5kX4GFMvlXoA)k1AlLP'
      })
      .then((response) => {
        pagination.setTotal((response as any).total);

        setQuestions((response as any).items);
        setIsLoaded(true);
      });
  }, [pagination.page, pagination.perPage]);

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
