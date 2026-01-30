import {baseURL} from "@/lib/api";
import qs from "qs";
import {strapiDateToDate} from "@/lib/utils";
import {z} from "zod";


// Zod schema to type and validate incoming Strapi data
const PublicationSchema = z.object({
  data: z.array(z.object({
    id: z.number(),
    title: z.string(),
    author: z.string(),
    publicationDate: z.string().transform(strapiDateToDate),
    linkToPublication: z.string().nullable().transform(v => v ?? undefined),
    topics: z.array(z.object({
      tagName: z.string(),
    })).transform(topics => topics.map(t => t.tagName)),
  }))
});
// [number] means extract the type of single array element. This allows Publication[] later.
export type Publication = z.infer<typeof PublicationSchema>['data'][number];


const MAX_RECORDS = 99999;

/**
 * Get list of all initialPublications
 */
export async function getPublications(): Promise<Publication[]> {
  const query = {
    fields: ['title', 'author', 'publicationDate', 'linkToPublication'],
    populate: {
      topics: {
        fields: ['tagName']
      }
    },
    pagination: {
      pageSize: MAX_RECORDS,
    },
    sort: ["publicationDate:desc"]
  }
  const params = qs.stringify(query);
  try {
    // fetch caches data at NextJS so that it does not have to query Strapi
    // and the database the Webhook informs NextJS an administrator has added/modified
    // data to strapi.
    {
      // next: {
      //   tags: ['strapi'],
      //   // 30 minutes
      //   revalidate: 1800
      // }
    }
    const res = await fetch(`${baseURL}publications?${params}`,
    )
    const parsed = PublicationSchema.parse(await res.json());
    return parsed.data;
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : 'Unknown error loading publications';
    throw new Error(message);
  }
}