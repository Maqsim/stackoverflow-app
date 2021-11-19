import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { UserType } from '../interfaces/UserType';
import { socketClient } from '../uitls/stackexchange-socket-client';
import { SidebarCountsType } from '../interfaces/SidebarCountsType';
import { IPCOnAuthResponseType } from '../interfaces/ipc-events/IPCOnAuthResponseType';
import { FeaturesEnum } from '../interfaces/FeaturesEnum';
import { makeFeatureList } from '../uitls/is-feature-enabled';

export type UserContextState = {
  user: UserType;
  features: FeaturesEnum[];
  isFeatureOn: (feature: FeaturesEnum) => boolean;
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
  const [features, setFeatures] = useState<FeaturesEnum[]>([]);
  const [sidebarCounts, setSidebarCounts] = useState<SidebarCountsType>({
    bookmarks: 0,
    questions: 0,
    answers: 0,
    tags: 0
  } as SidebarCountsType);

  const isFeatureOn = useCallback(
    (feature: FeaturesEnum) => {
      return features.includes(feature);
    },
    [features]
  );

  const sharedState: UserContextState = {
    user,
    features,
    isFeatureOn,
    sidebarCounts,
    setSidebarCounts
  };

  useEffect(() => {
    window.Main.on('stackexchange:on-auth', async ({ user, sidebarCounts, token }: IPCOnAuthResponseType) => {
      localStorage.setItem('token', token);
      socketClient.connect();

      setUser(user);
      setFeatures(makeFeatureList(user.reputation));
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
