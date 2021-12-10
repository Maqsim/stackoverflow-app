import { Box, Button, ButtonGroup, Center, Heading, HStack, Spinner, Stack, Text } from '@chakra-ui/react';
import { QuestionType } from '../../interfaces/QuestionType';
import { AnswerType } from '../../interfaces/AnswerType';
import { memo, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import stackoverflow from '../../uitls/stackexchange-api';
import parse from 'html-react-parser';
import { UserType } from '../../interfaces/UserType';

type Props = {
  user?: UserType;
};

export function TopPosts({ user }: Props) {
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [isPostsLoaded, setIsPostsLoaded] = useState(true);
  const [postType, setPostType] = useState<'questions' | 'answers' | undefined>();

  const [questions, setQuestions] = useState<QuestionType[]>();
  const [answers, setAnswers] = useState<AnswerType[]>();

  useEffect(() => {
    if (!user) {
      return;
    }

    (async () => {
      if (user.question_count) {
        await fetchQuestions();
        setPostType('questions');
      } else if (user.answer_count) {
        await fetchAnswers();
        setPostType('answers');
      }

      setIsInitialLoaded(true);
    })();
  }, [user]);

  async function fetchQuestions() {
    if (postType === 'questions' || !isPostsLoaded) {
      return;
    }

    setIsPostsLoaded(false);

    const response = (await stackoverflow.get(`users/${user?.user_id}/questions`, {
      sort: 'votes',
      order: 'desc',
      filter: '!HzgO6Jg6sME4H_1lyzjHHRxMDpvUVz34FqU_ckIV0XzN3qEw_80oXIpo62fBS4o8q9Wa31mkyd5kX4GFMvlXoA)k1AlLP'
    })) as any;

    setPostType('questions');
    setQuestions(response.items);
    setIsPostsLoaded(true);
  }

  async function fetchAnswers() {
    if (postType === 'answers' || !isPostsLoaded) {
      return;
    }

    setIsPostsLoaded(false);

    const response = (await stackoverflow.get(`users/${user?.user_id}/answers`, {
      sort: 'votes',
      order: 'desc',
      filter: '!LJbtD(0QAN3VMHtITzTNgH'
    })) as any;

    setPostType('answers');
    setAnswers(response.items);
    setIsPostsLoaded(true);
  }

  return (
    <Box rounded="5px" border="1px solid" borderColor="gray.200" p="16px">
      <HStack justify="space-between" mb="8px">
        <Heading size="md">Top posts</Heading>

        {isInitialLoaded && (user?.question_count || user?.answer_count) && (
          <ButtonGroup size="xs" isAttached variant="outline">
            <Button
              isDisabled={!user?.question_count}
              isActive={postType === 'questions'}
              onClick={fetchQuestions}
              mr="-px"
            >
              Questions
            </Button>
            <Button isDisabled={!user?.answer_count} isActive={postType === 'answers'} onClick={fetchAnswers}>
              Answers
            </Button>
          </ButtonGroup>
        )}
      </HStack>

      {!isInitialLoaded ? (
        <Center h="70px">
          <Spinner />
        </Center>
      ) : (
        <Stack spacing="4px" sx={{ opacity: isPostsLoaded ? 1 : 0.5, pointerEvents: isPostsLoaded ? 'auto' : 'none' }}>
          {isInitialLoaded &&
            (postType === 'questions' ? questions : answers)?.map((item) => (
              <PostItem item={item} type={postType!} key={item.question_id} />
            ))}
        </Stack>
      )}
    </Box>
  );
}

type PostItemsProps = {
  item: QuestionType | AnswerType;
  type: 'questions' | 'answers';
};

const PostItem = memo(({ item, type }: PostItemsProps) => {
  const scoreStyles = item.is_accepted
    ? { bgColor: 'green.300', color: 'white' }
    : { bgColor: 'white', color: 'gray.600', border: '1px solid #ccc' };

  return (
    <NavLink to={`/questions/${item.question_id}`} state={type === 'questions' && { question: item }}>
      <HStack color={item.is_accepted ? 'green.500' : 'blue.500'} align="start">
        <Center fontWeight="bold" sx={scoreStyles} rounded="5px" w="40px" h="25px" flexShrink={0}>
          {item.score}
        </Center>
        <Text>{parse(item.title!)}</Text>
      </HStack>
    </NavLink>
  );
});
