import {
  Box,
  Button,
  Center,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { socketClient } from '../../uitls/stackexchange-socket-client';
import { notification } from '../../uitls/notitification';
import stackoverflow from '../../uitls/stackexchange-api';
import { useUser } from '../../contexts/use-user';
import { ReputationHistoryItemType } from '../../interfaces/ReputationHistoryItemType';
import { kFormatter } from '../../uitls/k-formatter';
import { uniq } from 'lodash';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';

type PostType = {
  title: string;
  post_id: number;
  post_type: 'answer' | 'question';
};

export function ReputationDropdown() {
  const user = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [reputationHistoryItems, setReputationHistoryItems] = useState<ReputationHistoryItemType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUnseen, setIsUnseen] = useState(true);

  useEffect(() => {
    socketClient.on(`1-${user.user.user_id}-reputation`, () => {
      notification('Reputation', '+25');
    });

    fetchReputationHistory();
  }, []);

  async function fetchReputationHistory() {
    const response: any = await stackoverflow.get('me/reputation-history');
    const items: ReputationHistoryItemType[] = response.items;

    const postsIds = uniq(items.map((i) => i.post_id)).join(';');
    const postsResponse: any = await stackoverflow.get(`posts/${postsIds}`, { filter: '!az5Wc(MqdIquv2' });

    setPosts(postsResponse.items);
    setReputationHistoryItems(items);
  }

  function openReputation() {
    location.href = `https://stackoverflow.com/users/${user.user.user_id}?tab=reputation`;
  }

  function getPostById(postId: number) {
    return posts.find((i) => i.post_id === postId)!;
  }

  function close() {
    setIsUnseen(false);
    setIsOpen(false);
  }

  async function handleItemClick(item: ReputationHistoryItemType) {
    const post = getPostById(item.post_id);

    close();
    navigate(`/questions/${item.post_id}`, { state: { postType: post.post_type } });
  }

  return (
    <>
      <Popover isOpen={isOpen} onClose={close} onOpen={() => setIsOpen(true)}>
        <PopoverTrigger>
          <Center
            sx={{ WebkitAppRegion: 'no-drag' }}
            userSelect="none"
            px="8px"
            rounded="3px"
            _hover={{ color: 'whiteAlpha.700', bgColor: 'whiteAlpha.50' }}
            color="whiteAlpha.600"
          >
            <Text fontSize="12px" fontWeight="semibold">
              {kFormatter(user.user.reputation)}

              {isUnseen && (
                <Text as="span" ml="3px" px="3px" mt="1px" bgColor="green.400" color="whiteAlpha.800" rounded="2px">
                  +25
                </Text>
              )}
            </Text>
          </Center>
        </PopoverTrigger>
        <PopoverContent maxH="400px" overflowY="auto">
          <PopoverHeader>
            Reputation
            <Box float="right">
              <Button size="xs" onClick={openReputation}>
                See all
              </Button>
            </Box>
          </PopoverHeader>
          <PopoverBody>
            <Stack>
              {reputationHistoryItems.map((item, index) => {
                const post = getPostById(item.post_id);

                if (!post) {
                  return null;
                }

                return (
                  <HStack fontSize="13px" onClick={() => handleItemClick(item)} key={index} align="start">
                    <Text
                      flex="0 0 30px"
                      textAlign="right"
                      color={item.reputation_change > 0 ? 'green.500' : 'red.500'}
                    >
                      {item.reputation_change > 0 ? '+' : ''}
                      {item.reputation_change}
                    </Text>
                    <Text color="black">{parse(post.title)}</Text>
                  </HStack>
                );
              })}
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
