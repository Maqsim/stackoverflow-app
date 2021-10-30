import axios, { AxiosRequestConfig } from 'axios';

function buildStackOverflowUrl(path: string, parameters?: any) {
  let url = `https://api.stackexchange.com/2.3/${path}`;

  const queryString =
    parameters &&
    Object.keys(parameters)
      .map(function (key) {
        const value = parameters[key];
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

  if (queryString) {
    url = url + '?' + queryString;
  }

  return url;
}

const stackoverflow = {
  get: (url: string, parameters?: any, options?: AxiosRequestConfig) => {
    if (parameters) {
      parameters.site = 'stackoverflow';
      parameters.key = 'bdFSxniGkNbU3E*jsj*28w((';
      parameters.access_token = localStorage.getItem('token');
    }

    return axios(buildStackOverflowUrl(url, parameters), options).then((response) => response.data);
  },
  getLoggedInUser: () => {
    return stackoverflow.get('me', {}).then((response: any) => response.items[0]);
  },
  post: (url: string, data: unknown) => {
    return axios.post(buildStackOverflowUrl(url), data);
  }
};

export default stackoverflow;

// export const logout = (token: string) => {
//   let logoutPromise = fetch(
//     buildStackOverflowUrl('apps/' + token + '/de-authenticate', {
//       key: 'bdFSxniGkNbU3E*jsj*28w(('
//     })
//   );
//
//   // Remove acct cookies to logout user from SE
//   logoutPromise.then(() => {
//     window.Main.webContents.session.cookies.remove('https://stackexchange.com', 'acct', noop);
//   });
//
//   return logoutPromise;
// };

// class StackOverflowSocketClient {
//   constructor() {
//     this.subscribedActions = [];
//     this.unsubscribedActions = [];
//     this.callbacks = {};
//
//     this.socketConnectionPromise = new Promise((socketConnectionPromiseResolve, socketConnectionPromiseReject) => {
//       const connection = new WebSocket('wss://qa.sockets.stackexchange.com');
//
//       connection.onopen = function () {
//         socketConnectionPromiseResolve(connection);
//       };
//
//       connection.onerror = socketConnectionPromiseReject;
//
//       connection.onmessage = event => {
//         const response = JSON.parse(event.data);
//
//         // Stack Overflow doesn't allow us to unsubscribe from actions we subscribed
//         // so emulate unsubscribing by ignoring onMessage event
//         if (this.unsubscribedActions.includes(response.action)) {
//           return;
//         }
//
//         if (this.callbacks[response.action]) {
//           let json;
//
//           try {
//             json = JSON.parse(response.data);
//           } catch (ignore) {}
//
//           this.callbacks[response.action](json || response.data);
//         }
//       };
//     });
//   }
//
//   on(action, callback) {
//     this.socketConnectionPromise.then(connection => {
//       if (!this.subscribedActions.includes(action)) {
//         connection.send(action);
//         this.subscribedActions.push(action);
//         this.callbacks[action] = callback;
//       }
//     });
//   }
//
//   off(action) {
//     if (!this.unsubscribedActions.includes(action)) {
//       this.unsubscribedActions.push(action);
//
//       const index = this.subscribedActions.indexOf(action);
//       if (index !== -1) {
//         this.subscribedActions.splice(index, 1);
//       }
//     }
//   }
// }
//
// socketClient = new StackOverflowSocketClient;
