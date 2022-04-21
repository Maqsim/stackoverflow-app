import { Center, Stack, Text } from '@chakra-ui/react';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import { ImCheckmark } from 'react-icons/im';
import { BsBookmarkStar, BsFillBookmarkCheckFill } from 'react-icons/bs';

type Props = {
  score: number;
  bookmarkCount?: number;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  onUpvote?: () => void;
  onUnupvote?: () => void;
  onDownvote?: () => void;
  onUndownvote?: () => void;
  onToggleBookmark?: () => void;
  postType: 'question' | 'answer';
  isAccepted?: boolean;
  isBookmarked?: boolean;
};

export function VotingControls({
  isUpvoted,
  isDownvoted,
  isAccepted,
  isBookmarked,
  postType,
  score,
  bookmarkCount,
  onUpvote,
  onUnupvote,
  onDownvote,
  onUndownvote,
  onToggleBookmark
}: Props) {
  return (
    <Stack spacing="8px" mt="-5px">
      <Center
        fontSize="35px"
        color={isUpvoted ? 'orange.400' : 'gray.300'}
        cursor="pointer"
        _hover={isUpvoted ? undefined : { color: 'gray.400' }}
        userSelect="none"
        onClick={isUpvoted ? onUnupvote : onUpvote}
      >
        <GoTriangleUp />
      </Center>
      <Text textAlign="center" fontSize="20px" lineHeight="15px" color="gray.500">
        {score}
      </Text>
      <Center
        fontSize="35px"
        color={isDownvoted ? 'orange.400' : 'gray.300'}
        cursor="pointer"
        _hover={isDownvoted ? undefined : { color: 'gray.400' }}
        userSelect="none"
        onClick={isDownvoted ? onUndownvote : onDownvote}
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
