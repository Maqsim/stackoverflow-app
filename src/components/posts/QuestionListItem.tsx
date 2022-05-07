import parse from 'html-react-parser';
import { Box, Flex, HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TagList } from '../tags/TagList';
import { kFormatter } from '../../uitls/k-formatter';
import { memo, useState } from 'react';
import { getItem } from '../../uitls/local-storage';
import { IoCodeSlash, IoImageOutline } from 'react-icons/io5';
import { countInString } from '../../uitls/count-in-string';
import { MdSpeed } from 'react-icons/md';
import { pluralize } from '../../uitls/pluralize';
import isEqual from 'react-fast-compare';
import { QuestionType } from '../../models/question-store/question';
import { Bounty } from '../ui/Bounty';

type Props = {
  item: QuestionType;
};

export const QuestionListItem = memo(({ item }: Props) => {
  const visitedQuestionIds = (getItem('visited-question-ids') || []) as number[];
  const [isVisited] = useState(visitedQuestionIds.includes(item.question_id));
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const answersFactoidStyles = item.is_answered
    ? {
        bgColor: 'green.300',
        color: 'white'
      }
    : undefined;
  const hasBounty = Boolean(item.bounty_amount);

  // Helper icons
  // TODO Make analysis more accurate
  const hasLittleText = countInString('</p>', item.body) < 3;
  const hasCode = countInString('</pre>', item.body) > 0;
  const imageCount = countInString('<img src="https://i.stack.imgur.com', item.body);

  return (
    <RouterLink to={`/questions/${item.question_id}`} state={{ question: item }}>
      <Flex
        borderRadius="5px"
        cursor="pointer"
        transition="background-color 200ms ease"
        _hover={{ bgColor: hoverBg, transition: 'none' }}
        mx="-8px"
        p="8px"
        align="center"
      >
        <HStack
          flexShrink={0}
          mr="16px"
          spacing="2px"
          px="4px"
          bgColor="#fff"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="5px"
        >
          <Stack p="4px" spacing="0px">
            <Text fontWeight="bold" align="center" color={item.score === 0 ? 'gray.500' : 'inherit'}>
              {item.score}
            </Text>
            <Text fontSize="13px" color="gray.500">
              votes
            </Text>
          </Stack>
          <Stack p="4px" spacing="0px" sx={answersFactoidStyles}>
            <Text fontWeight="bold" align="center" color={item.answer_count === 0 ? 'gray.500' : 'inherit'}>
              {item.answer_count}
            </Text>
            <Text fontSize="13px" color={item.is_answered ? 'whiteAlpha.900' : 'gray.500'}>
              answers
            </Text>
          </Stack>
          <Stack p="4px" spacing="0px">
            <Text fontWeight="bold" align="center" color={item.view_count === 0 ? 'gray.500' : 'inherit'}>
              {kFormatter(item.view_count, 999)}
            </Text>
            <Text fontSize="13px" color="gray.500">
              views
            </Text>
          </Stack>
        </HStack>
        <Box flexGrow={1}>
          <Text fontWeight="bold" color={isVisited ? 'gray.400' : 'black'}>
            {hasBounty && <Bounty amount={item.bounty_amount!} mr="6px" />}

            {parse(item.title)}
          </Text>

          <Box mt="8px" h="24px" overflow="hidden">
            <HStack display="inline-flex" h="24px" spacing="10px" fontSize="13px" mr="10px">
              <Text
                opacity={hasLittleText ? 1 : 0.2}
                transform={hasLittleText ? 'none' : 'rotateY(-180deg)'}
                title={hasLittleText ? 'Low reading time' : undefined}
              >
                <MdSpeed />
              </Text>
              <Text opacity={hasCode ? 1 : 0.2} title={hasCode ? 'Question has code snippets' : undefined}>
                <IoCodeSlash />
              </Text>
              <Text
                opacity={imageCount ? 1 : 0.2}
                title={imageCount ? `Question has ${pluralize(imageCount, 'image')}` : undefined}
              >
                <IoImageOutline />
              </Text>
            </HStack>

            <TagList tags={item.tags} />
          </Box>
        </Box>
      </Flex>
    </RouterLink>
  );
}, isEqual);
