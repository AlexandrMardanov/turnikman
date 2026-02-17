export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time for comparison
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return 'Сьогодні';
  }

  if (date.getTime() === yesterday.getTime()) {
    return 'Вчора';
  }

  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  });
}
