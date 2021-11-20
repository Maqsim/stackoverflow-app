export function pluralize(count: number, noun: string, suffix = 's') {
  return `${count} ${noun}${count !== 1 ? suffix : ''}`;
}
