import {
  Box,
  Center,
  HStack,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text
} from '@chakra-ui/react';
import stackoverflow from '../../uitls/stackexchange-api';
import { useUser } from '../../contexts/use-user';
import { BsInboxFill } from 'react-icons/bs';
import { kFormatter } from '../../uitls/k-formatter';
import { useEffect } from 'react';
import { socketClient } from '../../uitls/stackexchange-socket-client';
import { notification } from '../../uitls/notitification';
import { useNavigate } from 'react-router-dom';
import { InboxDropdown } from './InboxDropdown';
import { ReputationDropdown } from './ReputationDropdown';

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
    socketClient.on(`1-${user.user.user_id}-reputation`, () => {
      notification('Reputation', '+25');
    });
  }, []);

  function goToProfile() {
    navigate(`/users/${user.user.user_id}`, { state: user.user });
  }

  return (
    <HStack justify="end" align="stretch" mr="16px" spacing={0}>
      <InboxDropdown />
      <ReputationDropdown />

      <Popover>
        {({ isOpen, onClose }) => (
          <>
            <PopoverTrigger>
              <Box
                marginStart="10px !important"
                _hover={{ filter: 'brightness(1.1)' }}
                sx={{ WebkitAppRegion: 'no-drag' }}
              >
                <Image src={user.user.profile_image} boxSize="25px" objectFit="cover" borderRadius="5px" />
              </Box>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aut consectetur eaque eius impedit labore
                laudantium magni numquam placeat quaerat, quas repellat sunt ut! Amet dolorem enim laboriosam obcaecati
                rerum.
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>

      {/*<Menu>*/}
      {/*  <MenuButton*/}
      {/*    */}
      {/*  >*/}
      {/*    */}
      {/*  </MenuButton>*/}
      {/*  <MenuList zIndex={200}>*/}
      {/*    <MenuItem onClick={goToProfile}>Profile</MenuItem>*/}
      {/*    <MenuItem command="⌘,">Settings</MenuItem>*/}
      {/*    <MenuDivider />*/}
      {/*    <MenuItem onClick={logout}>Logout</MenuItem>*/}
      {/*  </MenuList>*/}
      {/*</Menu>*/}
    </HStack>
  );
}
