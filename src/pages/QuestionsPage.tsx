import { useEffect } from 'react';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import { Box, Button, ButtonGroup, Flex, Stack } from '@chakra-ui/react';
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';
import { usePagination } from '../hooks/use-pagination';
import { Pagination } from '../components/ui/Pagination';
import { useStores } from '../models';
import { observer } from 'mobx-react-lite';

export const QuestionsPage = observer(() => {
  const { questionStore } = useStores();
  const pagination = usePagination();

  useEffect(() => {
    questionStore.getQuestions(pagination);
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
        {questionStore.isFetching &&
          [...Array(pagination.perPage)].map((_, index) => <QuestionListItemSkeleton key={index} />)}

        {!questionStore.isFetching &&
          questionStore.questions.map((question) => <QuestionListItem item={question} key={question.question_id} />)}
      </Stack>

      {pagination.totalPages > 0 && (
        <Box my="16px">
          <Pagination controller={pagination} />
        </Box>
      )}
    </>
  );
});
