import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { UserType } from '../interfaces/UserType';
import stackoverflow from '../unitls/stackexchange-api';
import { socketClient } from '../unitls/stackexchange-socket-client';

export type UserContextState = {
  data: UserType;
  token?: string;
};

export const UserContext = createContext<UserContextState>({} as UserContextState);

type Props = {
  LoadingComponent: ReactNode;
  children: ReactNode;
};

export const UserProvider = ({ children, LoadingComponent }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType>({} as UserType);
  const [token, setToken] = useState<string>();

  const sharedState: UserContextState = {
    data: user,
    token
  };

  useEffect(() => {
    window.Main.on('stackexchange:on-auth', async ({ token }: any) => {
      const loggedInUser = await stackoverflow.getLoggedInUser();

      socketClient.on(`1-${user.user_id}-reputation`, () => {
        new Notification('Reputation', { body: '+25' });
      });

      socketClient.on(`${user.account_id}-inbox`, () => {
        new Notification('Inbox', { body: 'You got new message' });
      });

      setToken(token);
      setUser(loggedInUser);
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
