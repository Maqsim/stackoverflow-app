import { useState } from 'react';
import { Box, Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { UserType } from '../interfaces/UserType';
import { useLocation } from 'react-router-dom';
import { BackButton } from '../components/layout/BackButton';

export function UserProfilePage() {
  const location = useLocation();
  const initialUser = location.state as UserType;
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<UserType>(initialUser);

  // useEffect(() => {
  //
  // }, []);

  return (
    <>
      <Flex justify="space-between" mb="32px">
        <BackButton />
      </Flex>

      <HStack spacing="16px">
        <Image src={user.profile_image} boxSize="64px" objectFit="cover" borderRadius="5px" />
        <Box>
          <Heading size="md" mb="4px">
            {user.display_name}
          </Heading>
          <Text>Full-stack developer</Text>
        </Box>
      </HStack>
    </>
  );
}
