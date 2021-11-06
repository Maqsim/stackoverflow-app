class StackOverflowSocketClient {
  subscribedActions: string[] = [];
  unsubscribedActions: string[] = [];
  callbacks: { [key: string]: (data: any) => void } = {};
  socketConnectionPromise: Promise<any> = Promise.resolve();

  constructor() {}

  connect() {
    this.socketConnectionPromise = new Promise((socketConnectionPromiseResolve, socketConnectionPromiseReject) => {
      const connection = new WebSocket('wss://qa.sockets.stackexchange.com');

      connection.onopen = function () {
        socketConnectionPromiseResolve(connection);
      };

      connection.onerror = socketConnectionPromiseReject;

      connection.onmessage = (event) => {
        const response: { action: string; data: any } = JSON.parse(event.data);

        // Heart-beat check
        if (response.action === 'hb') {
          connection.send(response.data);
        }

        // Stack Overflow doesn't allow us to unsubscribe from actions we subscribed
        // so emulate unsubscribing by ignoring onMessage event
        if (this.unsubscribedActions.includes(response.action)) {
          return;
        }

        if (this.callbacks[response.action]) {
          let json;

          try {
            json = JSON.parse(response.data);
          } catch (ignore) {}

          this.callbacks[response.action](json || response.data);
        }
      };
    });
  }

  on(action: string, callback: (data: any) => void) {
    this.socketConnectionPromise.then((connection) => {
      if (!this.subscribedActions.includes(action)) {
        connection.send(action);
        this.subscribedActions.push(action);
        this.callbacks[action] = callback;
      }
    });
  }

  off(action: string) {
    this.socketConnectionPromise.then((connection) => {
      connection.send(`-${action}`);
    });
  }
}

export const socketClient = new StackOverflowSocketClient();
