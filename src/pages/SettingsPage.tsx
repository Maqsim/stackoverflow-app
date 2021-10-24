import { Button, Heading, Stack, useColorMode } from '@chakra-ui/react';

export function SettingsPage() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Stack>
        <Heading size="md">Color mode</Heading>
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? 'dark' : 'light'}
        </Button>
      </Stack>
    </>
  );
}
