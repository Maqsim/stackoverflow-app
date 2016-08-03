const path = require('path');
const glob = require('glob');
const electron = require('electron');
const autoUpdater = require('./auto-updater');
const stackexchange = require('./main-process/stackexchange-auth');

const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const isDebug = /--debug/.test(process.argv[2]);
let mainWindow = null;

function initialize() {
  let shouldQuit = makeSingleInstance();
  if (shouldQuit) {
    return app.quit();
  }

  function createWindow() {
    let windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      frame: false,
      title: 'Stack Overflow'
    };

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png');
    }

    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (isDebug) {
      mainWindow.webContents.openDevTools();
      mainWindow.maximize();
    }

    // StackExchange authenticate
    mainWindow.webContents.on('dom-ready', () => {
      stackexchange.auth((token, expires) => {
        mainWindow.webContents.send('stackexchange:login', { token: token, expires: expires });
      });
    });

    // Show login window when user signs out
    ipcMain.on('stackexchange:show-login-form', () => {
      stackexchange.auth((token, expires) => {
        mainWindow.webContents.send('stackexchange:login', { token: token, expires: expires });
      });
    });

    mainWindow.on('closed', function () {
      mainWindow = null;
    })
  }

  app.on('ready', function () {
    createWindow();
    autoUpdater.initialize();
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow();
    }
  });
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) {
    return false;
  }

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }

      mainWindow.focus();
    }
  })
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(function () {
      app.quit();
    });

    break;
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(function () {
      app.quit();
    });

    break;
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit();
    break;
  default:
    initialize();
}
