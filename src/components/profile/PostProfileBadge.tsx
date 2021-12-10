import { Box, HStack, Image, Text } from '@chakra-ui/react';
import { UserType } from '../../interfaces/UserType';
import dayjs from 'dayjs';
import { kFormatter } from '../../uitls/k-formatter';
import parse from 'html-react-parser';
import { NavLink as RouterLink } from 'react-router-dom';

type Props = {
  datetime: number;
  user: UserType;
  type: 'question' | 'answer' | 'edit';
};

const typeToLabelMap: { [type: string]: string } = {
  question: 'Asked',
  answer: 'Answered',
  edit: 'Edited'
};

export function PostProfileBadge({ user, type, datetime }: Props) {
  const isQuestion = type === 'question';
  const isAnswer = type === 'answer';
  const isEdit = type === 'edit';

  return (
    <RouterLink to={`/users/${user.user_id}`} state={user}>
      <Box w="200px" p="8px" borderRadius="3px" bgColor={isQuestion ? 'gray.200' : 'none'} fontSize="13px">
        <Text color="#777" mb="6px" lineHeight="12px" fontSize="12px">
          {typeToLabelMap[type]} {dayjs().to(dayjs.unix(datetime))}
        </Text>
        <HStack>
          <Image src={user.profile_image} boxSize="32px" objectFit="cover" borderRadius="3px" />
          <Box overflow="hidden">
            <Text lineHeight="13px" my="1px" isTruncated>
              {parse(user.display_name)}
            </Text>
            <Text fontWeight="bold">{kFormatter(user.reputation)}</Text>
          </Box>
        </HStack>
      </Box>
    </RouterLink>
  );
}
