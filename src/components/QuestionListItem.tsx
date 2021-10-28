import parse from 'html-react-parser';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { QuestionType } from '../interfaces/QuestionType';
import { Link as RouterLink } from 'react-router-dom';
import { TagList } from './TagList';

type Props = {
  item: QuestionType;
};

export function QuestionListItem({ item }: Props) {
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <RouterLink to={{ pathname: `/questions/${item.question_id}`, state: item }}>
      <Box
        borderRadius="5px"
        cursor="pointer"
        transition="background-color 200ms ease"
        _hover={{ bgColor: hoverBg, transition: 'none' }}
        p="8px 12px"
      >
        <Text fontWeight="bold">{parse(item.title)}</Text>
        <TagList tags={item.tags} />
      </Box>
    </RouterLink>
  );
}
