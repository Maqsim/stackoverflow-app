import { app, BrowserWindow, clipboard, ipcMain, shell } from 'electron';
import { auth } from '../src/unitls/stackexchange-auth';
import { InvokeEnum } from '../src/interfaces/InvokeEnum';

let mainWindow: BrowserWindow | null;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function createWindow() {
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
    width: 1000,
    height: 600,
    show: false,
    title: 'StackOverflow',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 13 },
    webPreferences: {
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  //   shell.openExternal(url);
  //
  //   return { action: 'deny' };
  // });

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow?.show();

    auth((token, expires) => {
      mainWindow?.webContents.send('stackexchange:on-auth', {
        token: token,
        expires: expires
      });
    });
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (process.env.NODE_ENV === 'development' && url.includes('localhost')) {
      return;
    }

    event.preventDefault();

    shell.openExternal(url);
  });
}

async function registerListeners() {
  // This comes from bridge integration, check bridge.ts
  ipcMain.on('stackexchange-logout', (event) => {
    mainWindow?.webContents.session.cookies.remove('https://stackexchange.com', 'acct').then(() => {
      event.reply('stackexchange-did-logout');

      mainWindow?.webContents.session.cookies.get({}).then((value) => {
        console.log(value);
      });
    });
  });

  ipcMain.on('online', (event) => {
    event.reply('online');
  });

  ipcMain.on('offline', (event) => {
    event.reply('offline');
  });

  ipcMain.handle(InvokeEnum.COPY_TO_CLIPBOARD, (event, text) => {
    clipboard.writeText(text);
  });
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch((e) => console.error(e));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
