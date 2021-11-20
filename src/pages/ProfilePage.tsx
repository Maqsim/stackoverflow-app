import { useEffect, useState } from 'react';
import { Box, Flex, Heading, HStack, Image, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { UserType } from '../interfaces/UserType';
import { useLocation, useParams } from 'react-router-dom';
import { BackButton } from '../components/layout/BackButton';
import stackoverflow from '../uitls/stackexchange-api';
import { TopPosts } from '../components/profile/TopPosts';
import { Statistics } from '../components/profile/Statistics';
import parse from 'html-react-parser';
import { useMinDuration } from '../hooks/use-min-duration';
import dayjs from 'dayjs';
import { ExternalLink } from '../components/posts/ExternalLink';
import { removeProtocolFromUrl } from '../uitls/remove-protocol-from-url';

export function ProfilePage() {
  const { id } = useParams();
  const minDuration = useMinDuration(300);
  const location = useLocation();
  const initialUser = location.state as UserType;
  const [isLoaded, setIsLoaded] = useState(false);

  const [user, setUser] = useState<UserType>(initialUser);

  async function fetchAdditionalData() {
    // const response = (await ) as any;
    const response = (await minDuration(
      stackoverflow.get(`users/${user.user_id}`, {
        filter: '!0ZJUgZLp_(o9njLHPL0ZUMahE'
      })
    )) as any;

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
        <Stack flexGrow={1}>
          <Heading size="lg">{parse(user.display_name)}</Heading>

          {!isLoaded ? (
            <SkeletonText w="50%" noOfLines={2} />
          ) : (
            <HStack spacing="32px">
              <Stack spacing={0}>
                <Text>{user.location}</Text>
                {user.website_url && (
                  <ExternalLink href={user.website_url}>{removeProtocolFromUrl(user.website_url)}</ExternalLink>
                )}
              </Stack>
              <Stack spacing={0}>
                <Text>
                  Member for {' '}
                  <Text as="span" fontWeight="semibold">
                    {dayjs().to(dayjs.unix(user.creation_date), true)}
                  </Text>
                </Text>
                <Text>
                  Last seen {' '}
                  <Text as="span" fontWeight="semibold">
                    {dayjs().to(dayjs.unix(user.last_access_date))}
                  </Text>
                </Text>
              </Stack>
            </HStack>
          )}
        </Stack>
      </HStack>

      <HStack spacing="16px" align="start">
        <Box flex="0 0 33%">
          <Statistics user={isLoaded ? user : undefined} />
        </Box>

        <Box flexGrow={1}>
          <TopPosts user={isLoaded ? user : undefined} />
        </Box>
      </HStack>
    </Stack>
  );
}
