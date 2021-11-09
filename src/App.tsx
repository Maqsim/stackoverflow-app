import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { UserProvider } from './contexts/use-user';
import { AppSpinner } from './components/layout/AppSpinner';
import { SidebarProvider } from './contexts/use-sidebar';

export function App() {
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener('paste', (e) => {
      const clipboardData = e.clipboardData;
      const pastedText = clipboardData?.getData('text');

      if (pastedText && pastedText.startsWith('https://stackoverflow.com/questions/')) {
        const questionId = pastedText.replace('https://stackoverflow.com/questions/', '').split('/')[0];

        navigate(`/questions/${questionId}`);
      }
    });
  }, []);

  return (
    <UserProvider LoadingComponent={<AppSpinner />}>
      <SidebarProvider>
        <Layout />
      </SidebarProvider>
    </UserProvider>
  );
}
