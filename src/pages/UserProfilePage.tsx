import { memo, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text
} from '@chakra-ui/react';
import { UserType } from '../interfaces/UserType';
import { NavLink, useLocation } from 'react-router-dom';
import { BackButton } from '../components/layout/BackButton';
import { kFormatter } from '../unitls/k-formatter';
import stackoverflow from '../unitls/stackexchange-api';
import { AnswerType } from '../interfaces/AnswerType';
import { QuestionType } from '../interfaces/QuestionType';
import parse from 'html-react-parser';

export function UserProfilePage() {
  const location = useLocation();
  const initialUser = location.state as UserType;
  const [isLoaded, setIsLoaded] = useState(false);
  const [postType, setPostType] = useState<'questions' | 'answers'>('questions');
  const [isPostsLoaded, setIsPostsLoaded] = useState(false);
  const [user, setUser] = useState<UserType>(initialUser);
  const [questions, setQuestions] = useState<QuestionType[]>();
  const [answers, setAnswers] = useState<AnswerType[]>();

  async function fetchAdditionalData() {
    const response = (await stackoverflow.get(`users/${user.user_id}`, {
      filter: '!0ZJUgZLp_(o9njLHPL0ZUMahE'
    })) as any;

    setUser(response.items[0]);
    setIsLoaded(true);
  }

  async function fetchQuestions() {
    setIsPostsLoaded(false);

    const response = (await stackoverflow.get(`users/${user.user_id}/questions`, {
      sort: 'votes',
      order: 'desc',
      filter: '!2lIeW85m7AP2q5(2DO8AHd8vNJAJ.OC6dwg0q)FyXc3)q)1FQtsWrOG)TSOfFUEhv.NB4.T(WdmCieWUDmUVbR0*'
    })) as any;

    setQuestions(response.items);
    setIsPostsLoaded(true);
  }

  async function fetchAnswers() {
    setIsPostsLoaded(false);

    const response = (await stackoverflow.get(`users/${user.user_id}/answers`, {
      sort: 'votes',
      order: 'desc',
      filter: '!LJbtD(0QAN3VMHtITzTNgH'
    })) as any;

    setAnswers(response.items);
    setIsPostsLoaded(true);
  }

  useEffect(() => {
    fetchAdditionalData();
  }, []);

  useEffect(() => {
    if (postType === 'questions') {
      fetchQuestions();
    } else {
      fetchAnswers();
    }
  }, [postType]);

  return (
    <Stack spacing="32px">
      <Flex justify="space-between">
        <BackButton />
      </Flex>

      <HStack spacing="16px" align="start">
        <Image src={user.profile_image} boxSize="96px" objectFit="cover" borderRadius="5px" />
        <Stack>
          <Heading size="lg">
            {user.display_name}
          </Heading>
          {/*<Text>{user.about_me}</Text>*/}
          <Text>{user.website_url}</Text>
          {/*<Text>{user.location}</Text>*/}
        </Stack>
      </HStack>

      {!isLoaded ? (
        <Spinner />
      ) : (
        <HStack spacing="16px" align="start">
          <Box rounded="5px" border="1px solid" borderColor="gray.200" p="16px" flex="0 0 33%">
            <StatGroup>
              <Stat>
                <StatLabel>Reputation</StatLabel>
                <StatNumber>{kFormatter(user.reputation)}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Reached</StatLabel>
                <StatNumber>145k</StatNumber>
              </Stat>
            </StatGroup>

            <StatGroup mt="12px">
              <Stat>
                <StatLabel>Questions</StatLabel>
                <StatNumber>{kFormatter(user.question_count)}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Answers</StatLabel>
                <StatNumber>{kFormatter(user.answer_count)}</StatNumber>
              </Stat>
            </StatGroup>
          </Box>

          <Box rounded="5px" flexGrow={1} border="1px solid" borderColor="gray.200" p="16px">
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
                <PostItem item={item} type={postType} key={item.question_id} />
              ))}
            </Stack>
          </Box>
        </HStack>
      )}
    </Stack>
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
