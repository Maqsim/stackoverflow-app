const ACTION_KEY_DEFAULT = 'Ctrl';
const ACTION_KEY_APPLE = '⌘';

export function commandKey(key: string[]) {
  const isMac = process.platform === 'darwin';

  if (!isMac) {
    return `${ACTION_KEY_APPLE} ${key.join(' ')}`;
  } else {
    return `${ACTION_KEY_DEFAULT} ${key.join(' ')}`;
  }
}
