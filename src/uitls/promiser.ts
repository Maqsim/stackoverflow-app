export const promiser = (promise: Promise<unknown>) => {
  return promise.then((data) => [data, null]).catch((error) => [null, error]);
};
