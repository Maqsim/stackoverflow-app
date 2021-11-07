import { Flex, HStack, Image, Text } from '@chakra-ui/react';
import { CommentType } from '../../interfaces/CommentType';
import parse, { domToReact, Element } from 'html-react-parser';
import { Code } from '../posts/Code';
import dayjs from 'dayjs';
import { GoTriangleUp } from 'react-icons/go';
import { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

type Props = {
  comment: CommentType;
};

export function CommentListItem({ comment }: Props) {
  const [score, setScore] = useState(comment.score);

  function upvote() {
    setScore(score + 1);
  }

  return (
    <HStack align="flex-start" fontSize="13px">
      <HStack flexShrink={0} spacing="4px">
        <HStack spacing="2px">
          <Text fontSize="12px" color="gray.500" lineHeight="12px" w="16px" textAlign="right">
            {score || ''}
          </Text>
          <Flex
            fontSize="20px"
            cursor="pointer"
            color="gray.300"
            _hover={{ color: 'gray.400' }}
            userSelect="none"
            onClick={upvote}
            mt="-2px !important"
          >
            <GoTriangleUp />
          </Flex>
        </HStack>
        <RouterLink to={`/users/${comment.owner.user_id}`} state={comment.owner}>
          <Image src={comment.owner.profile_image} boxSize="24px" objectFit="cover" borderRadius="3px" title={comment.owner.display_name} />
        </RouterLink>
      </HStack>
      <Text alignSelf="center">
        {parse(comment.body, {
          replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === 'code') {
              return <Code fontSize="13px">{domToReact(domNode.children)}</Code>;
            }
          }
        })}
        <Text as="span" whiteSpace="nowrap" color="gray">
          {' '}
          – {dayjs().to(dayjs.unix(comment.creation_date))}
        </Text>
      </Text>
    </HStack>
  );
}
