return;

var authWindow = window.open('https://stackexchange.com/oauth/dialog?redirect_uri=https://stackexchange.com/oauth/login_success&client_id=7276&scope=write_access');
var access_token;
var expires;
var apiUrl = 'https://api.stackexchange.com/2.2';

// TODO refactor this
setTimeout(() => {
  var hashPosition = authWindow.location.indexOf('#') + 1;
  [access_token, expires] = authWindow.location.substring(hashPosition).split('&');
  access_token = access_token.split('=')[1];
  expires = expires.split('=')[1];

  authWindow.close();

  fetch(apiUrl + '/posts/19452895/comments/add', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: encodeURI('access_token=' + access_token + '&key=bdFSxniGkNbU3E*jsj*28w((&body=Hi there, I\'m 15 characters\' comment&preview=false&site=stackoverflow')
  }).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
    });
  });
}, 100);
