import { contextBridge, ipcRenderer } from 'electron';
import { InvokeEnum } from '../src/interfaces/InvokeEnum';

export const api = {
  /**
   * Overlay
   */
  openCodeInPreview: (html: string) => {
    ipcRenderer.invoke(InvokeEnum.OPEN_CODE_IN_PREVIEW, html);
  },
  openImageInPreview(src: string) {
    ipcRenderer.invoke(InvokeEnum.OPEN_IMAGE_IN_PREVIEW, src);
  },
  hideOverlay: () => {
    ipcRenderer.invoke(InvokeEnum.HIDE_OVERLAY);
  },

  copyToClipboard: (text: string) => {
    ipcRenderer.invoke(InvokeEnum.COPY_TO_CLIPBOARD, text);
  },
  send: (channel: string, data?: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
  logout: () => {
    ipcRenderer.send('stackexchange-logout');
  }
};

contextBridge.exposeInMainWorld('Main', api);
