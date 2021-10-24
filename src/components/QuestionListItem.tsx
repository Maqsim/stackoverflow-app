import parse from 'html-react-parser';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { QuestionType } from '../interfaces/QuestionType';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  item: QuestionType;
};

export function QuestionListItem({ item }: Props) {
  const tagBg = useColorModeValue('gray.200', 'gray.600');
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
        <HStack mt="4px" spacing="6px">
          {item.tags.map((tag) => (
            <Box p="2px 6px" fontSize="13px" borderRadius="3px" bgColor={tagBg} key={tag}>
              {tag}
            </Box>
          ))}
        </HStack>
      </Box>
    </RouterLink>
  );
}
