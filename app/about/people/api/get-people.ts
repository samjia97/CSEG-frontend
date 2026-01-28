import {z} from "zod";
import {api} from "@/lib/api";
import qs from "qs";


const PeopleSchema = z.array(z.object({
  documentId: z.string(),
  name: z.string(),
  description: z.string(),
  link: z.string().nullable(),
  picture: z.object({
    url: z.string(),
    alternativeText: z.string().nullable()
  })
}))

type PeopleData = z.infer<typeof PeopleSchema>;

export async function getPeopleData() :Promise<PeopleData>{
  // Warning: We assume no more than 100 CSEG organisers
  const query = qs.stringify({
    populate: {
      picture: {
        fields: ['alternativeText', 'url']
      }
    },
    fields:['documentId','name','description','link'],
    pagination: {
      pageSize: 100,
      page: 1,
    },
  })
  try {
    const res = await api.get(`/leaderships?${query}`)
    const parsedData = PeopleSchema.parse(res.data?.data);
    return parsedData;
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : 'Unkown error'
    throw new Error(message);
  }

}