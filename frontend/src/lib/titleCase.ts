/** Title-case each whitespace-delimited word for display and normalized categorical text. */
export function toTitleCase(input: string): string {
  const t = input.trim().replace(/\s+/g, ' ');
  if (!t) return '';
  return t
    .split(' ')
    .map((word) => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
