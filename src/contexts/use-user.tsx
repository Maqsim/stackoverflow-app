import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { UserType } from '../interfaces/UserType';
import stackoverflow from '../unitls/stackexchange-api';
import { socketClient } from '../unitls/stackexchange-socket-client';
import { notification } from '../unitls/notitification';

export type UserContextState = {
  data: UserType;
};

export const UserContext = createContext<UserContextState>({} as UserContextState);

type Props = {
  LoadingComponent: ReactNode;
  children: ReactNode;
};

export const UserProvider = ({ children, LoadingComponent }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType>({} as UserType);

  const sharedState: UserContextState = {
    data: user
  };

  useEffect(() => {
    window.Main.on('stackexchange:on-auth', async ({ token }: any) => {
      localStorage.setItem('token', token);
      socketClient.connect();

      setUser(await stackoverflow.getLoggedInUser());
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <>{LoadingComponent}</>;
  }

  return <UserContext.Provider value={sharedState}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
