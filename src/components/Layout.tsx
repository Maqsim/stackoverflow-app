import { Box, Center, Divider, Flex, Image, Stack, Text } from '@chakra-ui/react';
import UserPlaceholder from '../../assets/user-placeholder.jpeg';
import Logo from '../../assets/stackoverflow-logo.png';
import { MenuItem } from './MenuItem';
import { Route, Switch } from 'react-router-dom';
import { QuestionsPage } from '../pages/QuestionsPage';
import { QuestionDetailsPage } from '../pages/QuestionDetailsPage';
import { SearchBar } from './SearchBar';
import { RiEarthFill, RiSettings3Fill } from 'react-icons/ri';
import { SettingsPage } from '../pages/SettingsPage';
import { AiFillTags } from 'react-icons/ai';
import { MyQuestionsPage } from '../pages/MyQuestionsPage';

export function Layout() {
  return (
    <>
      <Center bgColor="gray.800" h="40px" css={{ '-webkit-app-region': 'drag' }}>
        <Box justifySelf="flex-start" flex={1} />
        <Box flex={1}>
          <SearchBar />
        </Box>
        <Box justifySelf="flex-end" flex={1}>
          <Image src={UserPlaceholder} boxSize="25px" objectFit="cover" borderRadius="5px" ml="auto" mr="10px" />
        </Box>
      </Center>
      <Flex h="calc(100vh - 40px)" alignItems={'stretch'}>
        <Stack bgColor="gray.700" color="white" flex={'0 0 200px'} overflow={'auto'} p="8px" justifyContent="space-between">
          <Box>
            <Image mt="8px" mb="16px" ml="10px" src={Logo} h="20px" />
            <Stack spacing={0}>
              <MenuItem to="/">
                <RiEarthFill />
                <Text>Questions</Text>
              </MenuItem>
              <MenuItem to="/tags">
                <AiFillTags />
                <Text>Tags</Text>
              </MenuItem>
            </Stack>
            <Box p="16px 8px">
              <Divider borderColor="gray.600" />
            </Box>
            <Stack spacing={0}>
              <MenuItem to="/my-questions">
                <Text>My questions</Text>
              </MenuItem>
              <MenuItem to="/my-answers">
                <Text>My answers</Text>
              </MenuItem>
              <MenuItem to="/my-inbox">
                <Text>My inbox</Text>
              </MenuItem>
              <MenuItem to="/my-tags">
                <Text>My tags</Text>
              </MenuItem>
            </Stack>
          </Box>

          <MenuItem to="/settings">
            <RiSettings3Fill />
            <Text>Settings</Text>
          </MenuItem>
        </Stack>
        <Box overflow={'auto'} p="16px" w="100%" id="scrolling-container">
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
