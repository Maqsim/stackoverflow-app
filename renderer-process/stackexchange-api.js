var win = require('electron').remote.getCurrentWindow();
const noop = () => {};

exports.buildStackOverflowUrl = (url, parameters) => {
  url = 'https://api.stackexchange.com/2.2/' + url;

  var queryString = '';
  for (var key in parameters) {
    var value = parameters[key];
    queryString += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
  }

  if (queryString.length > 0) {
    queryString = queryString.substring(0, queryString.length - 1); // Chop off last '&'
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
  let logoutPromise = fetch(exports.buildStackOverflowUrl('apps/' + token + '/de-authenticate', {
    key: 'bdFSxniGkNbU3E*jsj*28w(('
  }));

  // Remove acct cookies to logout user from SE
  logoutPromise.then(() => {
    win.webContents.session.cookies.remove('https://stackexchange.com', 'acct', noop);
  });

  return logoutPromise;
};
