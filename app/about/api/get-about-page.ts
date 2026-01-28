import {api} from "@/lib/api";
import {z} from "zod";

const AboutPageSchema = z.object({
  data: z.object({
    content: z.string()
  })
})
// ["data"] extracts the inner type
export type AboutPageData = z.infer<typeof  AboutPageSchema>["data"];

export async function getAboutPage (): Promise<AboutPageData> {
  try {
    const res = await api.get('/about-page')
    const parsed = AboutPageSchema.parse(res.data);
    return parsed.data;
  } catch (e){
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error(e);
    throw new Error(message);
  }

}