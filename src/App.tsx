import { ChakraProvider, Spinner } from '@chakra-ui/react';
import { HashRouter as Router } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { theme } from './styles/theme';
import { Layout } from './components/Layout';

export function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    window.Main.on('stackexchange:on-auth', ({ token }: any) => {
      localStorage.setItem('token', token);
      setIsAuthorized(true);
    });
  }, []);

  if (!isAuthorized) {
    return <Spinner />;
  }

  return (
    <Router>
      <ChakraProvider theme={theme}>
        <Layout />
      </ChakraProvider>
    </Router>
  );
}
