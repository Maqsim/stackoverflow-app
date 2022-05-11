import { useEffect } from 'react';
import { QuestionListItem } from '../components/posts/QuestionListItem';
import { Box, Center, Stack } from '@chakra-ui/react';
import { QuestionListItemSkeleton } from '../components/posts/QuestionListItem.skeleton';
import { Pagination } from '../components/ui/Pagination';
import { usePagination } from '../hooks/use-pagination';
import { useStores } from '../models';

export function MyBookmarksPage() {
  const { questionStore } = useStores();
  const pagination = usePagination();

  useEffect(() => {
    questionStore.getMyBookmarks(pagination);
  }, [pagination.page, pagination.perPage]);

  if (!questionStore.isMyBookmarksFetching && !questionStore.myBookmarks.length) {
    return (
      <Center color="gray.500" height="200px">
        You have no any bookmarks yet.
      </Center>
    );
  }

  return (
    <>
      <Stack spacing="8px">
        {/* Skeletons */}
        {questionStore.isMyBookmarksFetching &&
          [...Array(pagination.perPage)].map((_, index) => <QuestionListItemSkeleton key={index} />)}

        {!questionStore.isMyBookmarksFetching &&
          questionStore.myBookmarks.map((question) => <QuestionListItem item={question} key={question.question_id} />)}
      </Stack>

      {pagination.totalPages > 0 && (
        <Box my="16px">
          <Pagination controller={pagination} />
        </Box>
      )}
    </>
  );
}
