export function getItem(key: string) {
  let value;
  try {
    value = JSON.parse(localStorage.getItem(key) || '');
  } catch (ignore) {
    value = localStorage.getItem(key);
  }

  return value;
}

export function setItem(key: string, value: any, stringify = true) {
  try {
    localStorage.setItem(key, stringify ? JSON.stringify(value) : value);
  } catch (e) {
    console.trace(`localStorage: Can not set item ${key}`);
  }
}
