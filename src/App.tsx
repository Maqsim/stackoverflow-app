import { Center, ChakraProvider, Spinner } from '@chakra-ui/react';
import { HashRouter as Router } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { theme } from './styles/theme';
import { Layout } from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

export function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    window.Main.on('stackexchange:on-auth', ({ token }: any) => {
      localStorage.setItem('token', token);
      setIsAuthorized(true);
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
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
