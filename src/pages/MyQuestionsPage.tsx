import { useEffect } from 'react';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import { Box, Center, Stack } from '@chakra-ui/react';
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';
import { Pagination } from '../components/ui/Pagination';
import { usePagination } from '../hooks/use-pagination';
import { observer } from 'mobx-react-lite';
import { useStores } from '../models';

export const MyQuestionsPage = observer(() => {
  const { questionStore } = useStores();
  const pagination = usePagination();

  useEffect(() => {
    questionStore.getMyQuestions(pagination);
  }, [pagination.page, pagination.perPage]);

  if (!questionStore.isMyQuestionsFetching && !questionStore.myQuestions.length) {
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
        {questionStore.isMyQuestionsFetching &&
          [...Array(10)].map((_, index) => <QuestionListItemSkeleton key={index} />)}

        {!questionStore.isMyQuestionsFetching &&
          questionStore.myQuestions.map((question) => <QuestionListItem item={question} key={question.question_id} />)}
      </Stack>

      {pagination.totalPages > 0 && (
        <Box my="16px">
          <Pagination controller={pagination} />
        </Box>
      )}
    </>
  );
});
