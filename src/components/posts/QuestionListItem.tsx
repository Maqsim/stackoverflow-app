import parse from 'html-react-parser';
import { Box, Flex, HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { QuestionType } from '../../interfaces/QuestionType';
import { Link as RouterLink } from 'react-router-dom';
import { TagList } from './TagList';

type Props = {
  item: QuestionType;
};

export function QuestionListItem({ item }: Props) {
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <RouterLink to={{ pathname: `/questions/${item.question_id}`, state: item }}>
      <Flex
        className="question-list_item"
        borderRadius="5px"
        cursor="pointer"
        transition="background-color 200ms ease"
        _hover={{ bgColor: hoverBg, transition: 'none' }}
        mx="-8px"
        p="8px"
        align="center"
      >
        <HStack flexShrink={0} mr="16px" spacing="2px" px="4px" bgColor="#fff" border="1px solid" borderColor="gray.200" borderRadius="5px">
          <Stack size="30px" p="4px" spacing="0px">
            <Text fontWeight="semibold" align="center" color={item.score === 0 ? 'gray' : 'inherit'}>
              {item.score}
            </Text>
            <Text fontSize="13px" color="gray">
              votes
            </Text>
          </Stack>
          <Stack size="30px" p="4px" spacing="0px">
            <Text fontWeight="semibold" align="center" color={item.answer_count === 0 ? 'gray' : 'inherit'}>
              {item.answer_count}
            </Text>
            <Text fontSize="13px" color="gray">
              answers
            </Text>
          </Stack>
          <Stack size="30px" p="4px" spacing="0px">
            <Text fontWeight="semibold" align="center" color={item.view_count === 0 ? 'gray' : 'inherit'}>
              {item.view_count}
            </Text>
            <Text fontSize="13px" color="gray">
              views
            </Text>
          </Stack>
        </HStack>
        <Box flexGrow={1}>
          <Text fontWeight="bold">{parse(item.title)}</Text>

          <Box mt="4px">
            <TagList tags={item.tags} />
          </Box>
        </Box>
      </Flex>
    </RouterLink>
  );
}
