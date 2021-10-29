import { clipboard, contextBridge, ipcRenderer } from 'electron';

export const api = {
  auth: () => {
    ipcRenderer.send('message', 'auth');
  },
  copyToClipboard: (text: string) => {
    clipboard.writeText(text);
  },
  send: (channel: string, data?: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  }
};

contextBridge.exposeInMainWorld('Main', api);
