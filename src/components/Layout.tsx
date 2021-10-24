import { Box, Center, DarkMode, Divider, Flex, Image, Stack, Text } from '@chakra-ui/react';
import UserPlaceholder from '../../assets/user-placeholder.jpeg';
import Logo from '../../assets/stackoverflow-logo.png';
import { MenuItem } from './MenuItem';
import { Route, Switch } from 'react-router-dom';
import { QuestionListPage } from '../pages/QuestionListPage';
import { QuestionDetailsPage } from '../pages/QuestionDetailsPage';
import { SearchBar } from './SearchBar';
import { RiSettings3Fill } from 'react-icons/ri';
import { SettingsPage } from '../pages/SettingsPage';

export function Layout() {
  return (
    <>
      <Center
        bgColor="gray.800"
        h="40px"
        css={{ '-webkit-app-region': 'drag' }}
      >
        <Box justifySelf="flex-start" flex={1} />
        <Box flex={1}>
          <SearchBar />
        </Box>
        <Box justifySelf="flex-end" flex={1}>
          <Image
            src={UserPlaceholder}
            boxSize="25px"
            objectFit="cover"
            borderRadius="5px"
            ml="auto"
            mr="10px"
          />
        </Box>
      </Center>
      <Flex h="calc(100vh - 40px)" alignItems={'stretch'}>
        <Stack
          bgColor="gray.700"
          color="white"
          flex={'0 0 200px'}
          overflow={'auto'}
          p="8px"
          justifyContent="space-between"
        >
          <Box>
            <Image my="16px" ml="10px" src={Logo} h="25px" />
            <Stack spacing="0px">
              <MenuItem to="/">Questions</MenuItem>
              <MenuItem>Tags</MenuItem>
            </Stack>
          </Box>

          <MenuItem to="/settings">
            <RiSettings3Fill />
            <Text ml="0.25em">Settings</Text>
          </MenuItem>
        </Stack>
        <Box overflow={'auto'} p="16px" w="100%">
          <Switch>
            <Route path="/" exact component={QuestionListPage} />
            <Route path="/questions/:id" component={QuestionDetailsPage} />
            <Route path="/settings" component={SettingsPage} />
          </Switch>
        </Box>
      </Flex>
    </>
  );
}
