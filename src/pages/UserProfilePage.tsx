import { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text
} from '@chakra-ui/react';
import { UserType } from '../interfaces/UserType';
import { useLocation } from 'react-router-dom';
import { BackButton } from '../components/layout/BackButton';
import { kFormatter } from '../unitls/k-formatter';
import stackoverflow from '../unitls/stackexchange-api';

export function UserProfilePage() {
  const location = useLocation();
  const initialUser = location.state as UserType;
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<UserType>(initialUser);

  // Fetch more data
  useEffect(() => {
    stackoverflow
      .get(`users/${user.user_id}`, {
        filter: '!0ZJUgZLp_(o9njLHPL0ZUMahE'
      })
      // FIXME remove any
      .then((response: any) => {
        setUser(response.items[0]);
        setIsLoaded(true);
      });
  }, []);

  return (
    <Stack spacing="32px">
      <Flex justify="space-between">
        <BackButton />
      </Flex>

      <HStack spacing="16px" align="start">
        <Image src={user.profile_image} boxSize="96px" objectFit="cover" borderRadius="5px" />
        <Stack>
          <Heading size="lg" mb="4px">
            {user.display_name}
          </Heading>
          {/*<Text>{user.about_me}</Text>*/}
          <Text>{user.website_url}</Text>
          {/*<Text>{user.location}</Text>*/}
        </Stack>
      </HStack>

      {!isLoaded ? (
        <Spinner />
      ) : (
        <HStack spacing="16px" align="start">
          <Box rounded="5px" border="1px solid" borderColor="gray.200" p="16px" flex="0 0 33%">
            <StatGroup>
              <Stat>
                <StatLabel>Reputation</StatLabel>
                <StatNumber>{kFormatter(user.reputation)}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Reached</StatLabel>
                <StatNumber>?</StatNumber>
              </Stat>
            </StatGroup>

            <StatGroup mt="12px">
              <Stat>
                <StatLabel>Questions</StatLabel>
                <StatNumber>{kFormatter(user.question_count)}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Answers</StatLabel>
                <StatNumber>{kFormatter(user.answer_count)}</StatNumber>
              </Stat>
            </StatGroup>
          </Box>

          <Box rounded="5px" flexShring={1} border="1px solid" borderColor="gray.200" p="16px">
            <Heading size="md">Top posts</Heading>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium, alias asperiores corporis
            doloribus ducimus eum eveniet facere natus provident quae quos recusandae reiciendis ullam ut veritatis
            voluptas. Illum, quibusdam.
          </Box>
        </HStack>
      )}
    </Stack>
  );
}
