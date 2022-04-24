export function promiser<T>(promise: Promise<unknown>) {
  return promise.then((data) => [<T>data, null]).catch((error) => [null, error?.response ?? error]);
}
