import {SimpleStrapiImage} from "@/types/strapi-global-types";
import {api} from "@/lib/api";
import {BlocksContent} from "@strapi/blocks-react-renderer";
import qs from "qs";
type HomepageCardData = {
  text: string;
  image: SimpleStrapiImage;
  buttonText: string;
  buttonHref: string;
}
/**
 * Refined homepage data
 */
type HomepageData = {
  HeroText: BlocksContent;
  PublicationsCardText: string;
  ResearchProjectsCardText: string;
  AboutUsCardText: string;
  JoinUsCardText: string;
  ContactUsCardText: string;
  HeroImage: SimpleStrapiImage;
  PublicationsCardImage: SimpleStrapiImage;
  ResearchProjectsCardImage: SimpleStrapiImage;
  AboutUsCardImage: SimpleStrapiImage;
  JoinUsCardImage: SimpleStrapiImage;
  ContactUsCardImage: SimpleStrapiImage;
  // cardData
}
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
    const data = res.data.data?.attributes || res.data.data || res.data;
    const result: HomepageData = {
      HeroText: data.HeroText,
      PublicationsCardText: data.PublicationsCardText,
      ResearchProjectsCardText: data.ResearchProjectsCardText,
      AboutUsCardText: data.AboutUsCardText,
      JoinUsCardText: data.JoinUsCardText,
      ContactUsCardText: data.ContactUsCardText,
      HeroImage: {
        url: data.HeroImage.url,
        alternativeText: data.HeroImage.alternativeText,
        id: data.HeroImage.id,
      },
      PublicationsCardImage: {
        url: data.PublicationsCardImage.url,
        alternativeText: data.PublicationsCardImage.alternativeText,
        id: data.PublicationsCardImage.id,
      },
      ResearchProjectsCardImage: {
        url: data.ResearchProjectsCardImage.url,
        alternativeText: data.ResearchProjectsCardImage.alternativeText,
        id: data.ResearchProjectsCardImage.id,
      },
      AboutUsCardImage: {
        url: data.AboutUsCardImage.url,
        alternativeText: data.AboutUsCardImage.alternativeText,
        id: data.AboutUsCardImage.id,
      },
      JoinUsCardImage: {
        url: data.JoinUsCardImage.url,
        alternativeText: data.JoinUsCardImage.alternativeText,
        id: data.JoinUsCardImage.id,
      },
      ContactUsCardImage: {
        url: data.ContactUsCardImage.url,
        alternativeText: data.ContactUsCardImage.alternativeText,
        id: data.ContactUsCardImage.id,
      }
    }
    return result;
  } catch (e) {
    console.error(e);
  }
}