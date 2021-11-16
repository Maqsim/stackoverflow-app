const ACTION_KEY_DEFAULT = ['Ctrl', 'Control'];
const ACTION_KEY_APPLE = ['⌘', 'Command'];

export function commandKey(key: string[], filled = false) {
  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

  if (!isMac) {
    return `${ACTION_KEY_APPLE[+filled]} ${key.join(' ')}`;
  } else {
    return `${ACTION_KEY_DEFAULT[+filled]} ${key.join(' ')}`;
  }
}
