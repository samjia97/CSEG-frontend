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

/**
 * Converts Strapi date string to Date object. Raises error if invalid format.
 * @param dateString
 */
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

/**
 * Returns true if 2 objects contain the same values.
 * @param obj1
 * @param obj2
 */
export function deepEqual(obj1: any, obj2: any) : boolean {
  // pointing to same object or same primitive
  if (obj1 === obj2) return true;
  // both null or undefined
  if (obj1 == null || obj2 == null) return false;
  // one is not an object
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  // Different keys
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1){
    // Object 2 must include the same key and perform comparisons going down.
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])){
      return false;
    }
  }
  return true;
}