import { Box, Center, Text } from '@chakra-ui/react';
import { SearchBar } from './SearchBar';
import { MenuDropdown } from './MenuDropdown';
import { useEffect, useState } from 'react';

export function TopBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    window.Main.on('online', () => {
      setOffline((prevValue) => {
        if (prevValue) {
          setTimeout(() => {
            setIsVisible(false);
          }, 4000);
        }

        return false;
      });
    });

    window.Main.on('offline', () => {
      setOffline(true);
      setIsVisible(true);
    });
  }, []);

  return (
    <>
      <Center bgColor="gray.800" h="40px" sx={{ WebkitAppRegion: 'drag' }}>
        <Box justifySelf="flex-start" flex={1} />
        <Box flex={1}>
          <SearchBar />
        </Box>
        <Box justifySelf="flex-end" flex={1}>
          <MenuDropdown />
        </Box>
      </Center>

      <Center
        position="absolute"
        transitionProperty="transform background-color"
        transitionDuration="200ms"
        transitionTimingFunction="ease"
        transform={`translateY(${isVisible ? '0' : '-100%'})`}
        top={0}
        left={0}
        right={0}
        h="40px"
        bgColor={offline ? 'red.500' : 'green.500'}
      >
        <Text fontWeight="bold" color="white">
          {offline ? 'Offline' : "You're online now"}
        </Text>
      </Center>
    </>
  );
}
