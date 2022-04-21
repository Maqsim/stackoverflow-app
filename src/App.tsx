import { useEffect, useState } from 'react';
import { Layout } from './components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { UserProvider } from './contexts/use-user';
import { AppSpinner } from './components/layout/AppSpinner';
import stackoverflow from './uitls/stackexchange-api';
import { useToast } from '@chakra-ui/react';
import { RootStore, RootStoreProvider, setupRootStore } from './models';

export function App() {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await setupRootStore().then(setRootStore);
    })();

    // TODO See if we can remove 300ms delay here
    // This is needed to show main window and close splash screen
    setTimeout(() => {
      window.Main.send('main-window-ready');
    }, 300);

    // TODO Move out of here
    document.addEventListener('paste', (e) => {
      const clipboardData = e.clipboardData;
      const pastedText = clipboardData?.getData('text');

      if (pastedText && pastedText.startsWith('https://stackoverflow.com/questions/')) {
        const questionId = pastedText.replace('https://stackoverflow.com/questions/', '').split('/')[0];

        stackoverflow
          .get(`questions/${questionId}`, {
            filter: '!9MyMg2qFPpNbuLMPVtF3UyZX-N4MWSjZwlQ(VqCZ)UMRPTuNScvYNba'
          })
          .then((response) => {
            const question = (response as any).items[0];

            if (question) {
              navigate(`/questions/${questionId}`, { state: { question } });
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

  if (!rootStore) {
    return null;
  }

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
    <RootStoreProvider value={rootStore}>
      <UserProvider LoadingComponent={<AppSpinner />}>
        <Layout />
      </UserProvider>
    </RootStoreProvider>
  );
}
