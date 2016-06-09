const storage = require('electron-json-storage');

require('electron').ipcRenderer.on('stackexchange:login', (event, data) => {
  storage.set('access_token', data.access_token);
  storage.set('expires', data.expires);
});
