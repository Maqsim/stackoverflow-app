import { Box, DarkMode, Divider, Flex, Image, Stack, Text } from '@chakra-ui/react';
import Logo from '../../../assets/stackoverflow-logo.svg';
import { NavItem } from './NavItem';
import { Route, Routes } from 'react-router-dom';
import { QuestionsPage } from '../../pages/QuestionsPage';
import { QuestionDetailsPage } from '../../pages/QuestionDetailsPage';
import { RiEarthFill, RiSettings3Fill } from 'react-icons/ri';
import { SettingsGeneralPage } from '../../pages/settings/SettingsGeneralPage';
import { AiFillTags } from 'react-icons/ai';
import { MyQuestionsPage } from '../../pages/MyQuestionsPage';
import { ScrollToTop } from './ScrollToTop';
import { SponsorWidget } from './SponsorWidget';
import { ProfilePage } from '../../pages/ProfilePage';
import { MyBookmarksPage } from '../../pages/MyBookmarksPage';
import { TopBar } from './TopBar';
import { SearchPage } from '../../pages/SearchPage';
import { TagsPage } from '../../pages/TagsPage';
import { MyTagsPage } from '../../pages/MyTags';
import { UserContext } from '../../contexts/use-user';
import { MyAnswersPage } from '../../pages/MyAnswersPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { SettingsAdvancedPage } from '../../pages/settings/SettingsAdvancedPage';
import { SettingsAppearancePage } from '../../pages/settings/SettingsAppearancePage';
import { SettingsNotificationsPage } from '../../pages/settings/SettingsNotificationsPage';
import { SettingsHotkeysPage } from '../../pages/settings/SettingsHotkeysPage';
import { SettingsAccessibilityPage } from '../../pages/settings/SettingsAccessibilityPage';

export const Layout = () => {
  return (
    <>
      <TopBar />

      <Flex h="calc(100% - 40px)" alignItems={'stretch'}>
        <Stack
          bgColor="gray.700"
          color="white"
          flex={'0 0 200px'}
          overflow={'auto'}
          p="8px"
          justifyContent="space-between"
        >
          <DarkMode>
            <Box>
              <Image mt="8px" mb="16px" ml="10px" src={Logo} h="25px" />
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
                <UserContext.Consumer>
                  {({ sidebarCounts }) => (
                    <>
                      <NavItem to="/my-bookmarks" count={sidebarCounts.bookmarks}>
                        <Text>My bookmarks</Text>
                      </NavItem>
                      <NavItem to="/my-questions" count={sidebarCounts.questions}>
                        <Text>My questions</Text>
                      </NavItem>
                      <NavItem to="/my-answers" count={sidebarCounts.answers}>
                        <Text>My answers</Text>
                      </NavItem>
                      <NavItem to="/my-tags" count={sidebarCounts.tags}>
                        <Text>My tags</Text>
                      </NavItem>
                    </>
                  )}
                </UserContext.Consumer>
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
            <Route path="/questions/:id" element={<QuestionDetailsPage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/users/:id" element={<ProfilePage />} />
            <Route path="/tags" element={<TagsPage />} />

            {/* Personal routes */}
            <Route path="/my-bookmarks" element={<MyBookmarksPage />} />
            <Route path="/my-questions" element={<MyQuestionsPage />} />
            <Route path="/my-answers" element={<MyAnswersPage />} />
            <Route path="/my-tags" element={<MyTagsPage />} />

            {/* Settings routes */}
            <Route path="/settings" element={<SettingsPage />}>
              <Route index element={<SettingsGeneralPage />} />
              <Route path="appearance" element={<SettingsAppearancePage />} />
              <Route path="notifications" element={<SettingsNotificationsPage />} />
              <Route path="hotkeys" element={<SettingsHotkeysPage />} />
              <Route path="accessibility" element={<SettingsAccessibilityPage />} />
              <Route path="advanced" element={<SettingsAdvancedPage />} />
            </Route>
          </Routes>
        </Box>
      </Flex>
    </>
  );
};
