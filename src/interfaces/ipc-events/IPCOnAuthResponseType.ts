import { UserType } from '../UserType';
import { SidebarCountsType } from '../SidebarCountsType';

export type IPCOnAuthResponseType = {
  user: UserType;
  sidebarCounts: SidebarCountsType;
  token: string;
};
