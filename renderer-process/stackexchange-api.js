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
