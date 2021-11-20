export function removeProtocolFromUrl(url: string) {
  return url.replace(/^http(s)?:\/\//g, '');
}
