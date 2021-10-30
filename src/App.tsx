import { Center, ChakraProvider, Spinner } from '@chakra-ui/react';
import { HashRouter as Router } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { theme } from './styles/theme';
import { Layout } from './components/layout/Layout';
import stackoverflow from './unitls/stackexchange-api';

export function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    window.Main.on('stackexchange:on-auth', ({ token }: any) => {
      localStorage.setItem('token', token);
      setIsAuthorized(true);

      stackoverflow.getLoggedInUser().then((user) => {
        console.log(user, 2);
      });
    });
  }, []);

  return (
    <Router>
      <ChakraProvider theme={theme}>
        {isAuthorized ? (
          <Layout />
        ) : (
          <Center h="100vh">
            <Spinner />
          </Center>
        )}
      </ChakraProvider>
    </Router>
  );
}
