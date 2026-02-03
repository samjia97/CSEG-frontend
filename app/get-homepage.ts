import {SimpleStrapiImage} from "@/types/strapi-global-types";
import {api} from "@/lib/api";
import {BlocksContent} from "@strapi/blocks-react-renderer";
import qs from "qs";
import {z} from "zod";
type HomepageCardData = {
  text: string;
  image: SimpleStrapiImage;
  buttonText: string;
  buttonHref: string;
}

const HomepageSchema = z.object({
  HeroText: z.string(),
  HeroImage: z.object({
    alternativeText: z.string().nullable(),
    id: z.number(),
    url: z.string(),
  })
})

export type HomepageData = z.infer<typeof HomepageSchema>;
export async function getHomepage(){
  try {
    const query = qs.stringify(
      {
        populate: '*',
      },
      {
        encodeValuesOnly: true,
      }
    );
    const res = await api.get(`/home-page?${query}`);
    return HomepageSchema.parse(res.data?.data);
  } catch (e) {
    console.error(e);
  }
}