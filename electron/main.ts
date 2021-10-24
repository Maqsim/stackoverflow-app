import { app, BrowserWindow, ipcMain } from 'electron';
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
    title: 'StackOverflow',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#191622',
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

  // TODO
  // mainWindow.setTitle('StackOverflow')
  //
  // mainWindow.on('page-title-updated', function(e) {
  //   e.preventDefault()
  // });
}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    if (message === 'auth') {
      auth((token, expires) => {
        console.log(token, expires);
      });
    }
  });
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch((e) => console.error(e));

app.on('web-contents-created', (event, webContents) => {
  webContents.on('dom-ready', () => {
    auth((token, expires) => {
      webContents.send('stackexchange:on-auth', {
        token: token,
        expires: expires
      });
    });
  });
});

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
