import {
  Box,
  Button,
  Center,
  Image,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text
} from '@chakra-ui/react';
import { BsInboxFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { socketClient } from '../../uitls/stackexchange-socket-client';
import { notification } from '../../uitls/notitification';
import stackoverflow from '../../uitls/stackexchange-api';
import { useUser } from '../../contexts/use-user';
import { InboxItemType } from '../../interfaces/InboxItemType';
import parse from 'html-react-parser';

export function InboxDropdown() {
  const user = useUser();
  const [inboxItems, setInboxItems] = useState<InboxItemType[]>([]);

  useEffect(() => {
    socketClient.on(`${user.user.account_id}-inbox`, () => {
      notification('Inbox', 'You got new message');
    });

    fetchInbox();
  }, []);

  async function fetchInbox() {
    const response: any = await stackoverflow.get('inbox', { filter: '!3ynkBQq0J8)iUxi9L' }, undefined, false);

    setInboxItems(response.items);
  }

  function openInbox() {
    location.href = `https://stackexchange.com/users/${user.user.account_id}?tab=inbox`;
  }

  return (
    <>
      <Popover>
        {({ isOpen, onClose }) => (
          <>
            <PopoverTrigger>
              <Center
                sx={{ WebkitAppRegion: 'no-drag' }}
                px="8px"
                rounded="3px"
                _hover={{ color: 'whiteAlpha.700', bgColor: 'whiteAlpha.50' }}
                color="whiteAlpha.600"
              >
                <Text fontSize="16px">
                  <BsInboxFill />
                </Text>
                <Box boxSize="6px" bgColor="red.500" rounded="full" position="relative" ml="-1px" top="-6px" />
              </Center>
            </PopoverTrigger>
            <PopoverContent maxH="400px" overflowY="auto">
              <PopoverHeader>
                Inbox
                <Box float="right">
                  <Button size="xs" onClick={openInbox}>
                    See all
                  </Button>
                </Box>
              </PopoverHeader>
              <PopoverBody>
                <Stack>
                  {inboxItems.map((item) => (
                    <Link href={item.link} color="blue.500" textDecoration="none !important">
                      <Box fontSize="13px">
                        <Text sx={{ '.chakra-link:hover &': { textDecoration: 'underline' } }}>
                          <Image w="16px" display="inline" src={item.site.favicon_url} /> {item.title}
                        </Text>
                        <Text color="black">{parse(item.body)}</Text>
                      </Box>
                    </Link>
                  ))}
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </>
  );
}
