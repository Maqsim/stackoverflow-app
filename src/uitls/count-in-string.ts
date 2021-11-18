export function countInString(needly: string, haystack: string) {
  let results = 0;
  let a = haystack.indexOf(needly);

  while (a != -1) {
    haystack = haystack.slice(a * (1 + needly.length));
    results++;
    a = haystack.indexOf(needly);
  }

  return results;
}
