import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { auth } from '../src/unitls/stackexchange-auth';

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
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);

    return { action: 'deny' };
  });

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow?.show();

    auth((token, expires) => {
      mainWindow?.webContents.send('stackexchange:on-auth', {
        token: token,
        expires: expires
      });
    });
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
    console.log('online');
  });

  ipcMain.on('offline', (event) => {
    console.log('offline');
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
