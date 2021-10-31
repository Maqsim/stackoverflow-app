import { Box, Center, Divider, Flex, Image, Stack, Text } from '@chakra-ui/react';
import Logo from '../../../assets/stackoverflow-logo.png';
import { NavItem } from './NavItem';
import { Route, Switch } from 'react-router-dom';
import { QuestionsPage } from '../../pages/QuestionsPage';
import { QuestionDetailsPage } from '../../pages/QuestionDetailsPage';
import { SearchBar } from './SearchBar';
import { RiEarthFill, RiSettings3Fill } from 'react-icons/ri';
import { SettingsPage } from '../../pages/SettingsPage';
import { AiFillTags } from 'react-icons/ai';
import { MyQuestionsPage } from '../../pages/MyQuestionsPage';
import { UserMenuDropdown } from './UserMenuDropdown';
import ScrollToTop from './ScrollToTop';
import { SponsorWidget } from './SponsorWidget';

export function Layout() {
  return (
    <>
      <Center bgColor="gray.800" h="40px" css={{ '-webkit-app-region': 'drag' }}>
        <Box justifySelf="flex-start" flex={1} />
        <Box flex={1}>
          <SearchBar />
        </Box>
        <Box justifySelf="flex-end" flex={1}>
          <UserMenuDropdown />
        </Box>
      </Center>
      <Flex h="calc(100vh - 40px)" alignItems={'stretch'}>
        <Stack bgColor="gray.700" color="white" flex={'0 0 200px'} overflow={'auto'} p="8px" justifyContent="space-between">
          <Box>
            <Image mt="8px" mb="16px" ml="10px" src={Logo} h="20px" />
            <Stack spacing={0}>
              <NavItem to="/">
                <RiEarthFill />
                <Text>Questions</Text>
              </NavItem>
              <NavItem to="/tags">
                <AiFillTags />
                <Text>Tags</Text>
              </NavItem>
            </Stack>
            <Box p="16px 8px">
              <Divider borderColor="gray.600" />
            </Box>
            <Stack spacing={0}>
              <NavItem to="/my-questions">
                <Text>My questions</Text>
              </NavItem>
              <NavItem to="/my-answers">
                <Text>My answers</Text>
              </NavItem>
              <NavItem to="/my-inbox">
                <Text>My inbox</Text>
              </NavItem>
              <NavItem to="/my-tags">
                <Text>My tags</Text>
              </NavItem>
            </Stack>
          </Box>

          <Box>
            <SponsorWidget mb="32px" />

            <NavItem to="/settings">
              <RiSettings3Fill />
              <Text>Settings</Text>
            </NavItem>
          </Box>
        </Stack>
        <Box overflow={'auto'} p="16px" w="100%" id="scrolling-container">
          <ScrollToTop />
          <Switch>
            <Route path="/" exact component={QuestionsPage} />
            <Route path="/questions/:id" component={QuestionDetailsPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/my-questions" component={MyQuestionsPage} />
          </Switch>
        </Box>
      </Flex>
    </>
  );
}
