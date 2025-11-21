import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts title to slug by eliminating non-URL friendly characters
 * 1. Replace NOT whitespace, word character(a-Z-9) or - [^\w\s-] globally with ''
 * 2. Replace whitespace with -. Note the global flag comes after closing the escape /
 * 3. Replace groups of at least one - --- with just one -
 * @param title
 * @param documentId
 */
export function getSlug(title: string, documentId: string) {
  return title
  .toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, "-")
  .replace(/-+/g, '-') + '-' + documentId
}

export function strapiDateToDate(dateString: string): Date {
  if (dateString.includes('T')) {
    // Full ISO date-time string e.g. 2025-12-31T23:59:59
    const [date, time] = dateString.split('T');
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute, second] = time.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  } else if (dateString.includes('-')) {
    //Just a 2025-12-31 date
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  } else if (dateString.includes(':')) {
    //Just a time string e.g. 14:30:00
    const [hour, minute, second] = dateString.split(':').map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);
  }
  throw new Error(`Invalid date string format: ${dateString}`);
}

/**
 * When viewing a document page, extract the documentId from the slug
 * @param slug
 */
export function getDocumentIdFromSlug(slug: string) {
  return slug.substring(slug.lastIndexOf('-') + 1);
}