import { Flex, Stack, Text } from '@chakra-ui/react';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';

type Props = {
  score: number;
  onUpvote: () => void;
  onDownvote: () => void;
};

export function VotingControls({ score, onUpvote, onDownvote }: Props) {
  return (
    <Stack spacing={0} mt="-5px">
      <Flex
        justify="center"
        fontSize="35px"
        color="gray.300"
        cursor="pointer"
        _hover={{ color: 'gray.400' }}
        userSelect="none"
        onClick={onUpvote}
      >
        <GoTriangleUp />
      </Flex>
      <Text textAlign="center" fontSize="20px" color="gray.500">
        {score}
      </Text>
      <Flex
        justify="center"
        fontSize="35px"
        color="gray.300"
        cursor="pointer"
        _hover={{ color: 'gray.400' }}
        userSelect="none"
        onClick={onDownvote}
      >
        <GoTriangleDown />
      </Flex>
    </Stack>
  );
}
