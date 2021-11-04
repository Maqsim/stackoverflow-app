import { Center, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Layout } from './components/layout/Layout';
import stackoverflow from './unitls/stackexchange-api';
import { useNavigate } from 'react-router-dom';

export function App() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    window.Main.on('stackexchange:on-auth', ({ token }: any) => {
      localStorage.setItem('token', token);
      setIsAuthorized(true);

      stackoverflow.getLoggedInUser().then((user) => {
        // console.log(user, 2);
      });
    });

    document.addEventListener('paste', (e) => {
      const clipboardData = e.clipboardData;
      const pastedText = clipboardData?.getData('text');

      // FIXME on Question page when pastin new url hash is changing, but rerender missing
      if (pastedText && pastedText.startsWith('https://stackoverflow.com/questions/')) {
        const questionId = pastedText.replace('https://stackoverflow.com/questions/', '').split('/')[0];

        navigate(`/questions/${questionId}`, { replace: true });
      }
    });
  }, []);

  return (
    <>
      {isAuthorized ? (
        <Layout />
      ) : (
        <Center h="100vh">
          <Spinner />
        </Center>
      )}
    </>
  );
}
