const win = require('electron').remote.getCurrentWindow();

exports.buildStackOverflowUrl = (url, parameters) => {
  url = 'https://api.stackexchange.com/2.2/' + url;

  let queryString = parameters && Object.keys(parameters)
    .map(function (key) {
      var value = parameters[key];
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  if (queryString) {
    url = url + '?' + queryString;
  }

  return url;
};

exports.fetch = (url, parameters, options) => {
  if (parameters) {
    parameters.site = 'stackoverflow';
    parameters.key = 'bdFSxniGkNbU3E*jsj*28w((';
  }

  return fetch(exports.buildStackOverflowUrl(url, parameters), options).then((response) => {
    return response.json();
  });
};

exports.logout = (token) => {
  const logoutPromise = fetch(exports.buildStackOverflowUrl('apps/' + token + '/de-authenticate', {
    key: 'bdFSxniGkNbU3E*jsj*28w(('
  }));

  // Remove acct cookies to logout user from SE
  logoutPromise.then(() => {
    win.webContents.session.cookies.remove('https://stackexchange.com', 'acct', () => {

    });
  });

  return logoutPromise;
};

class StackOverflowSocketClient {
  constructor() {
    this.subscribedActions = [];

    this.socketConnectionPromise = new Promise((socketConnectionPromiseResolve, socketConnectionPromiseReject) => {
      const connection = new WebSocket('wss://qa.sockets.stackexchange.com');

      connection.onopen = function () {
        socketConnectionPromiseResolve(connection);
      };

      connection.onerror = socketConnectionPromiseReject;

      this.onMessagePromise = new Promise(onMessagePromiseResolve => {
        connection.onmessage = onMessagePromiseResolve;
      });
    });
  }

  on(message, callback) {
    this.socketConnectionPromise.then(connection => {
      if (!this.subscribedActions.includes(message)) {
        connection.send(message);
        this.subscribedActions.push(message)
      }

      this.onMessagePromise.then(event => {
        const response = JSON.parse(event.data);

        if (response.action === message) {
          let json;

          try {
            json = JSON.parse(response.data);
          } catch (ignore) {
          }

          callback(json || event.data);
        }
      })
    })
  }
}

exports.socketClient = new StackOverflowSocketClient;
