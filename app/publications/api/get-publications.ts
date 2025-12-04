import {api} from "@/lib/api";
import qs from "qs";
import {strapiDateToDate} from "@/lib/utils";
import { z } from "zod";

/**
 * based on
 *  {
 *             "id": 5,
 *             "documentId": "bx9jv0hbygchehg9je8olye5",
 *             "title": " Building upon the CAPE Framework for Broader Understanding of Capacity in K-12 CS Education.",
 *             "author": "McGill, M.M., Thompson, A., Gransbury, I., Heckman, S., Rosato, J. & DeLyser, L.A",
 *             "publicationDate": "2023-12-01",
 *             "createdAt": "2025-12-03T14:35:36.138Z",
 *             "updatedAt": "2025-12-03T14:38:54.576Z",
 *             "publishedAt": "2025-12-03T14:38:54.590Z",
 *             "linkToPublication": "https://doi.org/10.1145/3545945.3569725",
 *             "topics": [
 *                 {
 *                     "id": 17,
 *                     "documentId": "p5l91pndopf217t0w5x6a1v6",
 *                     "tagName": "Primary Education (P1-P7)",
 *                     "createdAt": "2025-11-26T10:00:21.163Z",
 *                     "updatedAt": "2025-11-26T10:00:21.163Z",
 *                     "publishedAt": "2025-11-26T10:00:21.174Z"
 *                 },
 *                 {
 *                     "id": 13,
 *                     "documentId": "rp40dsab3ghybbez3ygdiw25",
 *                     "tagName": "Academic Writing",
 *                     "createdAt": "2025-11-26T09:59:24.401Z",
 *                     "updatedAt": "2025-11-26T09:59:24.401Z",
 *                     "publishedAt": "2025-11-26T09:59:24.418Z"
 *                 }
 *             ]
 *         },
 *         {
 *             "id": 6,
 *             "documentId": "chzima0w7foovmop09ham94m",
 *             "title": "Building Shared Measures for Broadening Participation Initiatives. General Report38",
 *             "author": "Zarch, R., Peterfreund, A",
 *             "publicationDate": "2024-12-04",
 *             "createdAt": "2025-12-03T14:37:10.431Z",
 *             "updatedAt": "2025-12-03T14:39:54.817Z",
 *             "publishedAt": "2025-12-03T14:39:54.829Z",
 *             "linkToPublication": "https://doi.org/10.62572/jzamu35",
 *             "topics": [
 *                 {
 *                     "id": 29,
 *                     "documentId": "i9bu4c6spy99dq1yvf5g2ao6",
 *                     "tagName": "Accessibility and Inclusion",
 *                     "createdAt": "2025-11-26T10:05:01.175Z",
 *                     "updatedAt": "2025-11-26T10:05:01.175Z",
 *                     "publishedAt": "2025-11-26T10:05:01.187Z"
 *                 }
 *             ]
 *         },
 *         {
 *             "id": 8,
 *             "documentId": "jtpx6j0el4tephf9czfg6m4j",
 *             "title": "Measuring Teacher Growth Based on the CSTA K-12 Standards for CS Teachers. Proceedings of the ACM Technical Symposium on Computer Science Education",
 *             "author": "McGill, M., Bell, A",
 *             "publicationDate": "2023-12-02",
 *             "createdAt": "2025-12-03T14:40:47.187Z",
 *             "updatedAt": "2025-12-03T14:40:47.187Z",
 *             "publishedAt": "2025-12-03T14:40:47.208Z",
 *             "linkToPublication": "https://doi.org/10.1145/3545945.3569796",
 *             "topics": [
 *                 {
 *                     "id": 19,
 *                     "documentId": "fq32j9mdl2l3z7ewgiu23isf",
 *                     "tagName": "Secondary Education (S1-S6)",
 *                     "createdAt": "2025-11-26T10:00:44.126Z",
 *                     "updatedAt": "2025-11-26T10:00:44.126Z",
 *                     "publishedAt": "2025-11-26T10:00:44.133Z"
 *                 },
 *                 {
 *                     "id": 17,
 *                     "documentId": "p5l91pndopf217t0w5x6a1v6",
 *                     "tagName": "Primary Education (P1-P7)",
 *                     "createdAt": "2025-11-26T10:00:21.163Z",
 *                     "updatedAt": "2025-11-26T10:00:21.163Z",
 *                     "publishedAt": "2025-11-26T10:00:21.174Z"
 *                 }
 *             ]
 *         },
 */
export type Publication = {
  id: number;
  title: string;
  author: string;
  publicationDate: Date;
  linkToPublication?: string;
  topics: string[];
}

// Zod schemas to type and validate incoming Strapi data
const PublicationTopicSchema = z.object({
  tagName: z.string(),
});

const PublicationSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  publicationDate: z.string(),
  linkToPublication: z.string().nullable().optional(),
  topics: z.array(PublicationTopicSchema).optional(),
});

const PublicationsResponseSchema = z.object({
  data: z.array(PublicationSchema),
});

type PublicationFromStrapi = z.infer<typeof PublicationSchema>;

/**
 * Get list of all initialPublications
 */
export async function getPublications(){
  const query = {
    fields: ['title', 'author', 'publicationDate', 'linkToPublication'],
    populate: {
      topics: {
        fields: ['tagName']
      }
    },
    pagination:{
      // pageSize: -1,
    },
    sort: ["publicationDate:desc"]
  }
  const params = qs.stringify(query);
  const res = await api.get("/publications?"+params);

  // Validate and type incoming data from Strapi using Zod
  console.log('RAW', res.data,'END RAW')
  const parsed = PublicationsResponseSchema.parse(res.data);
  const publicationsData: PublicationFromStrapi[] = parsed.data;

  const publications: Publication[] = publicationsData.map((value) => ({
    id: value.id,
    title: value.title,
    author: value.author,
    publicationDate: strapiDateToDate(value.publicationDate),
    linkToPublication: value.linkToPublication ?? undefined,
    topics: value.topics ? value.topics.map((item) => item.tagName) : []
  }));

  return publications;
}