import { Image, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import UserPlaceholder from '../../assets/user-placeholder.jpeg';
import { api } from '../unitls/stackexchange-api';

export function UserMenuDropdown() {
  function logout() {
    api(`access-tokens/${localStorage.token}/invalidate`).then(() => {
      // window.Main.logout();
      window.Main.on('stackexchange-did-logout', () => {
        console.log('LOGOUTED');
      });
    });
  }

  return (
    <Menu>
      <MenuButton display="flex" ml="auto" mr="10px">
        <Image src={UserPlaceholder} boxSize="25px" objectFit="cover" borderRadius="5px" />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
}
