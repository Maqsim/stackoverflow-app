import { Box, HStack, Image, Link, Text } from '@chakra-ui/react';
import { UserType } from '../../interfaces/UserType';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { kFormatter } from '../../unitls/k-formatter';
import parse from 'html-react-parser';
import { NavLink as RouterLink } from 'react-router-dom';

dayjs.extend(RelativeTime);

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

export function UserBadge({ user, type, datetime }: Props) {
  const isQuestion = type === 'question';
  const isAnswer = type === 'answer';
  const isEdit = type === 'edit';

  return (
    <RouterLink to={`/users/${user.user_id}`} state={user}>
      <Link textDecor="none !important">
        <Box w="200px" p="8px" borderRadius="3px" bgColor={isQuestion ? 'gray.200' : 'none'} fontSize="13px">
          <Text color="#777" mb="6px" lineHeight="13px">
            {typeToLabelMap[type]} {dayjs().to(dayjs.unix(datetime))}
          </Text>
          <HStack w="calc(100% - 48px)">
            <Image src={user.profile_image} boxSize="32px" objectFit="cover" borderRadius="3px" />
            <Box>
              <Text lineHeight="13px" my="1px" isTruncated>
                {parse(user.display_name)}
              </Text>
              <Text fontWeight="bold">{kFormatter(user.reputation)}</Text>
            </Box>
          </HStack>
        </Box>
      </Link>
    </RouterLink>
  );
}
