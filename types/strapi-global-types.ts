export type SimpleStrapiImage = {
  alternativeText: string;
  url: string;
  id: number;
}
/**
 * For images where size is largely determined by Strapi
 */
export type FullStrapiImage = {
  alternativeText: string;
  url: string;
  id: number;
  width: number;
  height: number;
}