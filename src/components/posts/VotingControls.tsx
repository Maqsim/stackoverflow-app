import { Center, Stack, Text } from '@chakra-ui/react';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import { ImCheckmark } from 'react-icons/im';
import { BsBookmarkStar, BsFillBookmarkCheckFill } from 'react-icons/bs';

type Props = {
  score: number;
  bookmarkCount?: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onToggleBookmark?: () => void;
  postType: 'question' | 'answer';
  isAccepted?: boolean;
  isBookmarked?: boolean;
};

export function VotingControls({
  isAccepted,
  isBookmarked,
  postType,
  score,
  bookmarkCount,
  onUpvote,
  onDownvote,
  onToggleBookmark
}: Props) {
  return (
    <Stack spacing="8px" mt="-5px">
      <Center
        fontSize="35px"
        color="gray.300"
        cursor="pointer"
        _hover={{ color: 'gray.400' }}
        userSelect="none"
        onClick={onUpvote}
      >
        <GoTriangleUp />
      </Center>
      <Text textAlign="center" fontSize="20px" lineHeight="15px" color="gray.500">
        {score}
      </Text>
      <Center
        fontSize="35px"
        color="gray.300"
        cursor="pointer"
        _hover={{ color: 'gray.400' }}
        userSelect="none"
        onClick={onDownvote}
      >
        <GoTriangleDown />
      </Center>

      {postType === 'question' && (
        <Stack spacing={0}>
          <Center
            userSelect="none"
            cursor="pointer"
            fontSize="18px"
            color={isBookmarked ? 'gray.400' : 'gray.300'}
            _hover={{ color: 'gray.400' }}
            py="6px"
            onClick={onToggleBookmark}
          >
            {isBookmarked ? <BsFillBookmarkCheckFill /> : <BsBookmarkStar />}
          </Center>
          {bookmarkCount && (
            <Text color="gray.500" textAlign="center" fontSize="12px">
              {bookmarkCount}
            </Text>
          )}
        </Stack>
      )}

      {isAccepted && (
        <Center fontSize="23px" color="green.500">
          <ImCheckmark />
        </Center>
      )}
    </Stack>
  );
}
