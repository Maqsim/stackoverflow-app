import { Box, Center, HStack, Image, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from '@chakra-ui/react';
import stackoverflow from '../../uitls/stackexchange-api';
import { useUser } from '../../contexts/use-user';
import { BsInboxFill } from 'react-icons/bs';
import { kFormatter } from '../../uitls/k-formatter';
import { useEffect } from 'react';
import { socketClient } from '../../uitls/stackexchange-socket-client';
import { notification } from '../../uitls/notitification';
import { useNavigate } from 'react-router-dom';

export function MenuDropdown() {
  const navigate = useNavigate();
  const user = useUser();

  function logout() {
    stackoverflow.get(`access-tokens/${localStorage.token}/invalidate`).then(() => {
      // window.Main.logout();
      window.Main.on('stackexchange-did-logout', () => {
        // console.log('LOGOUTED');
      });
    });
  }

  useEffect(() => {
    socketClient.on(`1-${user.data.user_id}-reputation`, () => {
      notification('Reputation', '+25');
    });

    socketClient.on(`${user.data.account_id}-inbox`, () => {
      notification('Inbox', 'You got new message');
    });
  }, []);

  function goToProfile() {
    navigate(`/users/${user.data.user_id}`, { state: user.data });
  }

  return (
    <HStack justify="end" align="stretch" mr="16px" spacing={0} sx={{ WebkitAppRegion: 'no-drag' }}>
      <Center
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
      <Center
        px="8px"
        rounded="3px"
        _hover={{ color: 'whiteAlpha.700', bgColor: 'whiteAlpha.50' }}
        color="whiteAlpha.600"
      >
        <Text fontSize="12px" fontWeight="semibold">
          {kFormatter(user.data.reputation)}
          <Text as="span" ml="3px" px="3px" mt="1px" bgColor="green.400" color="whiteAlpha.800" rounded="2px">
            +25
          </Text>
        </Text>
      </Center>

      <Menu>
        <MenuButton marginStart="10px !important" _hover={{ filter: 'brightness(1.1)' }}>
          <Image src={user.data.profile_image} boxSize="25px" objectFit="cover" borderRadius="5px" />
        </MenuButton>
        <MenuList zIndex={200}>
          <MenuItem onClick={goToProfile}>Profile</MenuItem>
          <MenuItem command="⌘,">Settings</MenuItem>
          <MenuDivider />
          <MenuItem onClick={logout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
}
