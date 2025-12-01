/**
 * Formats a Date object to a human-readable string in GB format
 * @param date - The date to format
 * @returns Formatted date string (e.g., "20 November 2025")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
