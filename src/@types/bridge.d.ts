import { api } from '../../electron/bridge';

declare global {
  interface Window {
    Main: typeof api;
    PR: { prettyPrint: () => void };
  }
}
