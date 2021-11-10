export function getItem(key: string) {
  let value;
  try {
    value = JSON.parse(localStorage.getItem(key) || '');
  } catch (ignore) {}

  return value;
}

export function setItem(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.trace(`localStorage: Can not set item ${key}`);
  }
}
