import { Box, Center, DarkMode, Divider, Flex, Image, Stack, Text } from '@chakra-ui/react';
import Logo from '../../../assets/stackoverflow-logo.png';
import { NavItem } from './NavItem';
import { Route, Routes } from 'react-router-dom';
import { QuestionsPage } from '../../pages/QuestionsPage';
import { QuestionDetailsPage } from '../../pages/QuestionDetailsPage';
import { RiEarthFill, RiSettings3Fill } from 'react-icons/ri';
import { SettingsPage } from '../../pages/SettingsPage';
import { AiFillTags } from 'react-icons/ai';
import { MyQuestionsPage } from '../../pages/MyQuestionsPage';
import { ScrollToTop } from './ScrollToTop';
import { SponsorWidget } from './SponsorWidget';
import { UserProfilePage } from '../../pages/UserProfilePage';
import { MyBookmarksPage } from '../../pages/MyBookmarksPage';
import { useSidebar } from '../../contexts/use-sidebar';
import { TopBar } from './TopBar';

export function Layout() {
  const sidebar = useSidebar();

  return (
    <>
      <TopBar />

      <Flex h="calc(100vh - 40px)" alignItems={'stretch'}>
        <Stack bgColor="gray.700" color="white" flex={'0 0 200px'} overflow={'auto'} p="8px" justifyContent="space-between">
          <DarkMode>
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
                <NavItem to="/my-bookmarks" count={sidebar.counts.bookmarks}>
                  <Text>My bookmarks</Text>
                </NavItem>
                <NavItem to="/my-questions" count={sidebar.counts.questions}>
                  <Text>My questions</Text>
                </NavItem>
                <NavItem to="/my-answers" count={sidebar.counts.answers}>
                  <Text>My answers</Text>
                </NavItem>
                <NavItem to="/my-tags" count={sidebar.counts.tags}>
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
          </DarkMode>
        </Stack>
        <Box overflow={'auto'} p="16px" w="100%" id="scrolling-container">
          <ScrollToTop />
          <Routes>
            {/* Global routes */}
            <Route path="/" element={<QuestionsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/questions/:id" element={<QuestionDetailsPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />

            {/* Personal routes */}
            <Route path="/my-bookmarks" element={<MyBookmarksPage />} />
            <Route path="/my-questions" element={<MyQuestionsPage />} />
          </Routes>
        </Box>
      </Flex>
    </>
  );
}
