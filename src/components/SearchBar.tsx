import { Center, Text } from '@chakra-ui/react';
import { QuestionType } from '../interfaces/QuestionType';

type Props = {
  item: QuestionType;
};

export function SearchBar() {
  return (
    <Center
      borderRadius="5px"
      cursor="pointer"
      bgColor="gray.600"
      transition="background-color 200ms ease"
      _hover={{ bgColor: 'gray.500' }}
      w="350px"
      h="25px"
    >
      <Text>Search questions and answers</Text>
    </Center>
  );
}
