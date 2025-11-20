import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts title to slug by eliminating non-URL friendly characters
 * 1. Replace NOT whitespace, word character(a-Z-9) or - [^\w\s-] globally with ''
 * 2. Replace whitespace with -. Note the global flag comes after closing the escape /
 * 3. Replace groups of at least one - --- with just one -
 * @param title
 */
export function getSlug(title: string) {
  return title
  .toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g,'')
  .replace(/\s+/g,"-")
  .replace(/-+/g,'-')
}