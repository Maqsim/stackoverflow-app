import { contextBridge, ipcRenderer } from 'electron';
import { InvokeEnum } from '../src/interfaces/InvokeEnum';

export const api = {
  copyToClipboard: (text: string) => {
    ipcRenderer.invoke(InvokeEnum.COPY_TO_CLIPBOARD, text);
  },
  send: (channel: string, data?: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  }
};

contextBridge.exposeInMainWorld('Main', api);
