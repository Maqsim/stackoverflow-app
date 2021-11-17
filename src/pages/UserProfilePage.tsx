import { useEffect, useState } from 'react';
import { Box, Flex, Heading, HStack, Image, Stack, Text } from '@chakra-ui/react';
import { UserType } from '../interfaces/UserType';
import { useLocation, useParams } from 'react-router-dom';
import { BackButton } from '../components/layout/BackButton';
import stackoverflow from '../uitls/stackexchange-api';
import { TopPosts } from '../components/profile/TopPosts';
import { Statistics } from '../components/profile/Statistics';

export function UserProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const initialUser = location.state as UserType;
  const [isLoaded, setIsLoaded] = useState(false);

  const [user, setUser] = useState<UserType>(initialUser);

  async function fetchAdditionalData() {
    const response = (await stackoverflow.get(`users/${user.user_id}`, {
      filter: '!0ZJUgZLp_(o9njLHPL0ZUMahE'
    })) as any;

    setUser(response.items[0]);
    setIsLoaded(true);
  }

  useEffect(() => {
    fetchAdditionalData();
  }, [id]);

  return (
    <Stack spacing="32px">
      <Flex justify="space-between">
        <BackButton />
      </Flex>

      <HStack spacing="16px" align="start">
        <Image src={user.profile_image} boxSize="96px" objectFit="cover" borderRadius="5px" />
        <Stack>
          <Heading size="lg">{user.display_name}</Heading>
          {/*<Text>{user.about_me}</Text>*/}
          <Text>{user.website_url}</Text>
          {/*<Text>{user.location}</Text>*/}
        </Stack>
      </HStack>

      <HStack spacing="16px" align="start">
        <Box flex="0 0 33%">
          <Statistics user={isLoaded ? user : undefined} />
        </Box>

        <Box flexGrow={1}>
          <TopPosts userId={parseInt(id!, 10)} />
        </Box>
      </HStack>
    </Stack>
  );
}
