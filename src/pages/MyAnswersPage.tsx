import { useEffect } from 'react';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import { Box, Center, Stack, Text } from '@chakra-ui/react';
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';
import { Pagination } from '../components/ui/Pagination';
import { usePagination } from '../hooks/use-pagination';
import { useStores } from '../models';
import { observer } from 'mobx-react-lite';

export const MyAnswersPage = observer(() => {
  const { questionStore } = useStores();
  const pagination = usePagination();

  useEffect(() => {
    questionStore.getMyAnswers(pagination);
  }, [pagination.page, pagination.perPage]);

  if (!questionStore.isMyAnswersFetching && !questionStore.myAnswers.length) {
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
        {questionStore.isMyAnswersFetching &&
          [...Array(pagination.perPage)].map((_, index) => <QuestionListItemSkeleton key={index} />)}

        {!questionStore.isMyAnswersFetching &&
          questionStore.myAnswers.map((question) => <QuestionListItem item={question} key={question.question_id} />)}
      </Stack>

      {pagination.totalPages > 0 && (
        <Box my="16px">
          <Pagination controller={pagination} />
        </Box>
      )}
    </>
  );
});
