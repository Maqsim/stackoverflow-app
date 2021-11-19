import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { UserType } from '../interfaces/UserType';
import { socketClient } from '../uitls/stackexchange-socket-client';
import { SidebarCountsType } from '../interfaces/SidebarCountsType';
import { IPCOnAuthResponseType } from '../interfaces/ipc-events/IPCOnAuthResponseType';

export type UserContextState = {
  user: UserType;
  sidebarCounts: SidebarCountsType;
  setSidebarCounts: (counts: SidebarCountsType) => void;
};

export const UserContext = createContext<UserContextState>({} as UserContextState);

type Props = {
  LoadingComponent: ReactNode;
  children: ReactNode;
};

export const UserProvider = ({ children, LoadingComponent }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType>({} as UserType);
  const [sidebarCounts, setSidebarCounts] = useState<SidebarCountsType>({
    bookmarks: 0,
    questions: 0,
    answers: 0,
    tags: 0
  } as SidebarCountsType);

  const sharedState: UserContextState = {
    user: user,
    sidebarCounts,
    setSidebarCounts
  };

  useEffect(() => {
    window.Main.on('stackexchange:on-auth', async ({ token, sidebarCounts, user }: IPCOnAuthResponseType) => {
      localStorage.setItem('token', token);
      socketClient.connect();

      setUser(user);
      setSidebarCounts(sidebarCounts);
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
