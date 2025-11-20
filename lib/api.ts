import axios from "axios";

export const baseURL = process.env.BASE_URL;
export const api = axios.create({
  baseURL: process.env.BASE_URL,
})

/**
 * Get the full URL for a Strapi image
 * @param url - The relative URL from Strapi (e.g., "/uploads/image.png")
 * @returns The full URL to the image
 */
export function getStrapiImageUrl(url: string): string {
  const baseUrl = process.env.BASE_URL || 'http://localhost:1337/api/';
  // Remove /api/ from base URL to get the Strapi root
  const strapiRoot = baseUrl.replace('/api/', '');
  return `${strapiRoot}${url}`;
}