import { BrowserWindow } from 'electron';

export const auth = (scb: (token: string, expires: string) => void) => {
  const authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false
    }
  });

  const loadAuthUrl = () => {
    authWindow.loadURL(
      'https://stackexchange.com/oauth/dialog?redirect_uri=https://stackexchange.com/oauth/login_success&client_id=7276&scope=private_info read_inbox'
    );
  };

  loadAuthUrl();

  // Extract `did-finish-load` handler to own function so we can unbind it later
  const showAuthWindowIfNotLoggedIn = () => {
    authWindow.show();
  };

  const unloadAndCloseAuthWindow = () => {
    authWindow.webContents.removeListener('did-finish-load', showAuthWindowIfNotLoggedIn);
    authWindow.destroy();
  };

  authWindow.webContents.on('did-redirect-navigation', (event, url) => {
    const isMainPage = !/[a-zA-Z]+/.test(url.replace(/(https|http)/, '').replace('//stackexchange.com', ''));

    if (isMainPage) {
      return loadAuthUrl();
    }

    const isError = url.indexOf('error') >= 0;
    const hasToken = url.indexOf('access_token') >= 0;

    if (isError || !hasToken) {
      return;
    }

    // Success authentication
    const hashPosition = url.indexOf('#') + 1;
    let [token, expires] = url.substring(hashPosition).split('&');
    token = token.split('=')[1];
    expires = expires.split('=')[1];

    scb(token, expires);

    unloadAndCloseAuthWindow();
  });

  // This event can be unregistered by `did-get-redirect-request` handler
  authWindow.webContents.on('did-finish-load', showAuthWindowIfNotLoggedIn);

  authWindow.on('closed', () => {
    // authWindow = null;
  });
};
