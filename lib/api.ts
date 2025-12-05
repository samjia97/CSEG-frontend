import axios from "axios";

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:1337/api';
export const api = axios.create({
  baseURL: baseURL,
})

/**
 * Get the full URL for a Strapi image
 * @param url - The relative URL from Strapi (e.g., "/uploads/image.png")
 * @returns The full URL to the image
 */
export function getStrapiImageUrl(url: string): string {
  // Remove /api/ from base URL to get the Strapi root
  if (url.startsWith('http')){
    return url;
  } else {
    const strapiRoot = baseURL.replace('/api/', '');
    return `${strapiRoot}${url}`;
  }
}