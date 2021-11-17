import { Box, Button, ButtonGroup, Center, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { QuestionType } from '../../interfaces/QuestionType';
import { AnswerType } from '../../interfaces/AnswerType';
import { memo, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import stackoverflow from '../../uitls/stackexchange-api';
import parse from 'html-react-parser';

type Props = {
  userId: number;
}

export function TopPosts({ userId }: Props) {
  const [isPostsLoaded, setIsPostsLoaded] = useState(false);
  const [postType, setPostType] = useState<'questions' | 'answers'>('questions');

  const [questions, setQuestions] = useState<QuestionType[]>();
  const [answers, setAnswers] = useState<AnswerType[]>();

  useEffect(() => {
    if (postType === 'questions') {
      fetchQuestions();
    } else {
      fetchAnswers();
    }
  }, [postType]);

  async function fetchQuestions() {
    setIsPostsLoaded(false);

    const response = (await stackoverflow.get(`users/${userId}/questions`, {
      sort: 'votes',
      order: 'desc',
      filter: '!2lIeW85m7AP2q5(2DO8AHd8vNJAJ.OC6dwg0q)FyXc3)q)1FQtsWrOG)TSOfFUEhv.NB4.T(WdmCieWUDmUVbR0*'
    })) as any;

    setQuestions(response.items);
    setIsPostsLoaded(true);
  }

  async function fetchAnswers() {
    setIsPostsLoaded(false);

    const response = (await stackoverflow.get(`users/${userId}/answers`, {
      sort: 'votes',
      order: 'desc',
      filter: '!LJbtD(0QAN3VMHtITzTNgH'
    })) as any;

    setAnswers(response.items);
    setIsPostsLoaded(true);
  }

  return (
    <Box rounded="5px" border="1px solid" borderColor="gray.200" p="16px">
      <HStack justify="space-between" mb="8px">
        <Heading size="md">Top posts</Heading>

        <ButtonGroup size="xs" isAttached variant="outline">
          <Button isActive={postType === 'questions'} onClick={() => setPostType('questions')} mr="-px">
            Questions
          </Button>
          <Button isActive={postType === 'answers'} onClick={() => setPostType('answers')}>
            Answers
          </Button>
        </ButtonGroup>
      </HStack>

      <Stack spacing="4px">
        {(postType === 'questions' ? questions : answers)?.map((item) => (
          <PostItem item={item} type={postType} key={item.question_id}/>
        ))}
      </Stack>
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
    <NavLink to={`/questions/${item.question_id}`} state={type === 'questions' && item}>
      <HStack color={item.is_accepted ? 'green.500' : 'blue.500'} align="start">
        <Center fontWeight="bold" sx={scoreStyles} rounded="5px" w="40px" h="25px" flexShrink={0}>
          {item.score}
        </Center>
        <Text>{parse(item.title!)}</Text>
      </HStack>
    </NavLink>
  );
});
