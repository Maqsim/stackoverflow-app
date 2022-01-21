import { Box, Heading, HStack, List, ListIcon, ListItem, Stack, useColorMode } from '@chakra-ui/react';
import { MdPowerSettingsNew } from 'react-icons/md';
import { BsBell, BsEye, BsLayoutSidebar } from "react-icons/bs";
import { FaRegKeyboard } from "react-icons/fa";
import { GrAccessibility } from "react-icons/gr";
import { RiSettings3Line } from "react-icons/ri";

export function SettingsPage() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Stack spacing="12px">
        <Heading size="lg" mt="16px">
          Settings
        </Heading>
        <HStack alignItems="start" spacing="16px">
          <Box w="200px" flexShrink={0}>
            <List spacing="3px">
              <ListItem p="3px 10px" cursor="pointer" bgColor="blue.600" color="white" rounded="3px">
                <ListIcon as={MdPowerSettingsNew} />
                General
              </ListItem>
              <ListItem p="3px 10px" cursor="pointer" _hover={{ bgColor: 'gray.100' }} rounded="3px">
                <ListIcon as={BsEye} />
                Appearance
              </ListItem>
              <ListItem p="3px 10px" cursor="pointer" _hover={{ bgColor: 'gray.100' }} rounded="3px">
                <ListIcon as={BsLayoutSidebar} />
                Sidebar
              </ListItem>
              <ListItem p="3px 10px" cursor="pointer" _hover={{ bgColor: 'gray.100' }} rounded="3px">
                <ListIcon as={BsBell} />
                Notifications
              </ListItem>
              <ListItem p="3px 10px" cursor="pointer" _hover={{ bgColor: 'gray.100' }} rounded="3px">
                <ListIcon as={FaRegKeyboard} />
                Hotkeys
              </ListItem>
              <ListItem p="3px 10px" cursor="pointer" _hover={{ bgColor: 'gray.100' }} rounded="3px">
                <ListIcon as={GrAccessibility} />
                Accessibility
              </ListItem>
              <ListItem p="3px 10px" cursor="pointer" _hover={{ bgColor: 'gray.100' }} rounded="3px">
                <ListIcon as={RiSettings3Line} />
                Advanced
              </ListItem>
            </List>
          </Box>
          <Box flexGrow={1}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium amet dicta ex fugiat illum inventore
            magnam quidem quos vel! Animi deserunt eos ipsa iste magnam odit quos ullam unde veritatis.
          </Box>
        </HStack>
      </Stack>
    </>
  );
}
