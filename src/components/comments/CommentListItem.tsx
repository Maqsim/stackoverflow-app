import { Flex, HStack, Image, Text } from '@chakra-ui/react';
import { CommentType } from '../../interfaces/CommentType';
import parse, { domToReact, Element } from 'html-react-parser';
import { Code } from '../ui/Code';
import dayjs from 'dayjs';
import { GoTriangleUp } from 'react-icons/go';
import { NavLink as RouterLink } from 'react-router-dom';
import { useUser } from '../../contexts/use-user';

type Props = {
  comment: CommentType;
  onUpvote: () => void;
};

export function CommentListItem({ comment, onUpvote }: Props) {
  const user = useUser();
  const isMyComment = comment.owner.user_id === user.user.user_id;

  return (
    <HStack align="flex-start" fontSize="13px">
      <HStack flexShrink={0} spacing="4px">
        <HStack spacing="2px">
          <Text fontSize="12px" color="gray.500" lineHeight="12px" w="16px" textAlign="right">
            {comment.score || ''}
          </Text>
          <Flex
            fontSize="20px"
            cursor="pointer"
            visibility={isMyComment ? 'hidden' : 'visible'}
            color={comment.upvoted ? 'orange.400' : 'gray.300'}
            _hover={{ color: comment.upvoted ? 'orange.400' : 'gray.400' }}
            userSelect="none"
            onClick={onUpvote}
            mt="-2px !important"
          >
            <GoTriangleUp />
          </Flex>
        </HStack>
        <RouterLink to={`/users/${comment.owner.user_id}`} state={comment.owner}>
          <Image
            src={comment.owner.profile_image}
            boxSize="24px"
            objectFit="cover"
            borderRadius="3px"
            title={comment.owner.display_name}
          />
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
