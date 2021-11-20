import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserProvider } from './contexts/use-user';
import { AppSpinner } from './components/layout/AppSpinner';
import { stackoverflow } from './uitls/stackexchange-api';
import { useToast } from '@chakra-ui/react';

export function App() {
  const toast = useToast();
  const navigate = useNavigate();

  // TODO Move out of here
  useEffect(() => {
    document.addEventListener('paste', (e) => {
      const clipboardData = e.clipboardData;
      const pastedText = clipboardData?.getData('text');

      if (pastedText && pastedText.startsWith('https://stackoverflow.com/questions/')) {
        const questionId = pastedText.replace('https://stackoverflow.com/questions/', '').split('/')[0];

        stackoverflow
          .get(`questions/${questionId}`, {
            filter: '!9MyMg2qFPpNbuLMPVtF3UyZX-N4MWSjZwlQ(VqCZ3LoiM_GpZITfZz5'
          })
          .then((response) => {
            const question = response.items[0];

            if (question) {
              navigate(`/questions/${questionId}`, { state: question });
            } else {
              showErrorToast('This question was removed');
            }
          })
          .catch(() => {
            showErrorToast('The question was not found');
          });
      }
    });
  }, []);

  function showErrorToast(errorMessage: string) {
    toast({
      position: 'top',
      description: errorMessage,
      status: 'error',
      duration: 3000,
      isClosable: false
    });
  }

  return (
    <UserProvider LoadingComponent={<AppSpinner />}>
      <Layout />
    </UserProvider>
  );
}
