export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }).replace('.', '');
}
