const win = require('electron').remote.getCurrentWindow();
const noop = () => {};

exports.buildStackOverflowUrl = (url, parameters) => {
  url = 'https://api.stackexchange.com/2.2/' + url;

  let queryString = Object.keys(parameters)
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
    win.webContents.session.cookies.remove('https://stackexchange.com', 'acct', noop);
  });

  return logoutPromise;
};


// Creating a promise of web socket connection
var socketConnectionPromise = new Promise(function (resolve, reject) {
  const connection = new WebSocket('wss://qa.sockets.stackexchange.com/');

  connection.onopen = function () {
    resolve(connection);
  };

  connection.onerror = reject;
});

var onMessagePromise = new Promise(function (resolve) {
  socketConnectionPromise.then(function (connection) {
    connection.onmessage = resolve;
  });
});

exports.socket = {
  on: function (message, callback) {
    socketConnectionPromise.then(function (connection) {
      connection.send(message);

      onMessagePromise.then(response => {
        if (response.action === message) {
          let json;

          try {
            json = JSON.parse(response.data);
          } catch (ignore) {}

          callback(json || response.data);
        }
      })
    });
  }
};
