// Make function to decode HTML entities using textarea
export function decodeEntity(input: string) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = input;

  return textarea.value;
}
