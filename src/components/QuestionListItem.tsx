import { Box, HStack, Text } from "@chakra-ui/react";
import { QuestionType } from "../interfaces/QuestionType";
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  item: QuestionType;
};

export function QuestionListItem({ item }: Props) {
  return (
    <RouterLink to={`/questions/${item.question_id}`} >
      <Box
        borderRadius="5px"
        cursor="pointer"
        transition="background-color 200ms ease"
        _hover={{ bgColor: "gray.100", transition: "none" }}
        p="8px 12px"
      >
        <Text fontWeight="bold">{item.title}</Text>
        <HStack mt="4px" spacing="6px">
          {item.tags.map((tag) => (
            <Box p="2px 6px" fontSize="13px" borderRadius="3px" bgColor="gray.200">
              {tag}
            </Box>
          ))}
        </HStack>
      </Box>
    </RouterLink>
  );
}
