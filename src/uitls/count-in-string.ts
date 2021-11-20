export function countInString(needly: string, haystack: string) {
  return haystack.split(needly).length - 1;
}
