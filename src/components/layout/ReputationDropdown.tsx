import {
  Box,
  Button,
  Center,
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

  useEffect(() => {
    socketClient.on(`1-${user.user.user_id}-reputation`, () => {
      notification('Reputation', '+25');
    });

    fetchReputationHistory();
  }, []);

  async function fetchReputationHistory() {
    const response: any = await stackoverflow.get('me/reputation-history');
    const items: ReputationHistoryItemType[] = response.items;

    // items.reduce(() => {
    //
    // }, )

    const postsIds = uniq(items.map((i) => i.post_id)).join(';');
    const postsResponse: any = await stackoverflow.get(`posts/${postsIds}`, { filter: '!az5Wc(MqdIquv2' });

    setPosts(postsResponse.items);
    setReputationHistoryItems(response.items);
  }

  function openReputation() {
    location.href = `https://stackoverflow.com/users/${user.user.user_id}?tab=reputation`;
  }

  function getPostById(postId: number) {
    return posts.find((i) => i.post_id === postId)!;
  }

  function getTitleById(postId: number) {
    return posts.find((i) => i.post_id === postId)!.title;
  }

  async function handleItemClick(item: ReputationHistoryItemType) {
    const post = getPostById(item.post_id);

    setIsOpen(false);
    navigate(`/questions/${item.post_id}`, { state: { postType: post.post_type } });
  }

  return (
    <>
      <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} onOpen={() => setIsOpen(true)}>
        <PopoverTrigger>
          <Center
            sx={{ WebkitAppRegion: 'no-drag' }}
            px="8px"
            rounded="3px"
            _hover={{ color: 'whiteAlpha.700', bgColor: 'whiteAlpha.50' }}
            color="whiteAlpha.600"
          >
            <Text fontSize="12px" fontWeight="semibold">
              {kFormatter(user.user.reputation)}
              <Text as="span" ml="3px" px="3px" mt="1px" bgColor="green.400" color="whiteAlpha.800" rounded="2px">
                +25
              </Text>
            </Text>
          </Center>
        </PopoverTrigger>
        <PopoverContent maxH="400px" overflowY="auto">
          <PopoverHeader>
            Reputation history
            <Box float="right">
              <Button size="xs" onClick={openReputation}>
                See all
              </Button>
            </Box>
          </PopoverHeader>
          <PopoverBody>
            <Stack>
              {reputationHistoryItems.map((item, index) => (
                <Box fontSize="13px" onClick={() => handleItemClick(item)} key={index}>
                  <Text color="black">
                    {item.reputation_change} {getTitleById(item.post_id)}
                  </Text>
                </Box>
              ))}
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
