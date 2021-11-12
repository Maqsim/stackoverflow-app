export function useMinDuration(minDuration: number) {
  let startTimestamp: number;

  return (promise: Promise<unknown>) => {
    startTimestamp = Date.now();

    return new Promise((resolve) => {
      promise.then((result) => {
        const promiseDuration = Date.now() - startTimestamp;

        if (promiseDuration > minDuration) {
          return resolve(result);
        }

        setTimeout(() => {
          resolve(result);
        }, minDuration - promiseDuration);
      });
    });
  };
}
