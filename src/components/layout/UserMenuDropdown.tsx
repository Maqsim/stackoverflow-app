import { Box, Center, HStack, Image, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from '@chakra-ui/react';
import stackoverflow from '../../unitls/stackexchange-api';
import { useUser } from '../../contexts/use-user';
import { BsInboxFill } from 'react-icons/bs';
import { kFormatter } from '../../unitls/k-formatter';

export function UserMenuDropdown() {
  const user = useUser();

  function logout() {
    stackoverflow.get(`access-tokens/${localStorage.token}/invalidate`).then(() => {
      // window.Main.logout();
      window.Main.on('stackexchange-did-logout', () => {
        // console.log('LOGOUTED');
      });
    });
  }

  return (
    <HStack justify="end" align="stretch" mr="16px" spacing={0} sx={{ WebkitAppRegion: 'no-drag' }}>
      <Center px="8px" rounded="3px" _hover={{ color: 'whiteAlpha.700', bgColor: 'whiteAlpha.50' }} color="whiteAlpha.600">
        <Text fontSize="16px">
          <BsInboxFill />
        </Text>
        <Box boxSize="6px" bgColor="red.500" rounded="full" position="relative" ml="-1px" top="-6px" />
      </Center>
      <Center px="8px" rounded="3px" _hover={{ color: 'whiteAlpha.700', bgColor: 'whiteAlpha.50' }} color="whiteAlpha.600">
        <Text fontSize="12px" fontWeight="semibold">
          {kFormatter(user.data.reputation)}
          <Text as="span" ml="3px" px="3px" mt="1px" bgColor="green.500" color="whiteAlpha.800" rounded="2px">
            +25
          </Text>
        </Text>
      </Center>

      <Menu>
        <MenuButton marginStart="10px !important">
          <Image src={user.data.profile_image} boxSize="25px" objectFit="cover" borderRadius="5px" />
        </MenuButton>
        <MenuList zIndex={200}>
          <MenuItem>Profile</MenuItem>
          <MenuItem command="⌘,">Settings</MenuItem>
          <MenuDivider />
          <MenuItem onClick={logout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
}
