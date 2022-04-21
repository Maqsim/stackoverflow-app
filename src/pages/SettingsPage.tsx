import { Box, Heading, HStack, List, ListIcon, ListItem, Stack } from '@chakra-ui/react';
import { MdPowerSettingsNew } from 'react-icons/md';
import { BsBell, BsEye } from 'react-icons/bs';
import { FaRegKeyboard } from 'react-icons/fa';
import { RiSettings3Line } from 'react-icons/ri';
import { IoAccessibilityOutline } from 'react-icons/io5';
import { Link, matchPath, Outlet, useLocation } from 'react-router-dom';
import { IconType } from 'react-icons';

export function SettingsPage() {
  return (
    <>
      <Stack spacing="12px">
        <Heading size="lg" mt="16px">
          Settings
        </Heading>
        <HStack alignItems="start" spacing="16px">
          <Box w="200px" flexShrink={0}>
            <List>
              <NavItem link="" title="General" icon={MdPowerSettingsNew} />
              <NavItem link="appearance" title="Appearance" icon={BsEye} />
              <NavItem link="notifications" title="Notifications" icon={BsBell} />
              <NavItem link="hotkeys" title="Hotkeys" icon={FaRegKeyboard} />
              <NavItem link="accessibility" title="Accessibility" icon={IoAccessibilityOutline} />
              <NavItem link="advanced" title="Advanced" icon={RiSettings3Line} />
            </List>
          </Box>
          <Box flexGrow={1}>
            <Outlet />
          </Box>
        </HStack>
      </Stack>
    </>
  );
}

type NavItemProps = {
  link: string;
  icon: IconType;
  title: string;
};

function NavItem({ link, icon, title }: NavItemProps) {
  const location = useLocation();
  const isActive = matchPath(location.pathname, `/settings/${link}`);

  return (
    <Link to={link}>
      <ListItem
        p="4px 10px"
        cursor="pointer"
        color={isActive ? 'white' : undefined}
        bgColor={isActive ? 'blue.600' : undefined}
        _hover={isActive ? undefined : { bgColor: 'gray.100' }}
        rounded="5px"
      >
        <ListIcon as={icon} position="relative" top="-1px" />
        {title}
      </ListItem>
    </Link>
  );
}
