import {BlocksContent} from "@strapi/blocks-react-renderer";
import {api} from "@/lib/api";
import {strapiDateToDate} from "@/lib/utils";
import {FullStrapiImage} from "@/types/strapi-global-types";
import qs from "qs";

export type ResearchProjectPageData = {
  title: string;
  primaryInvestigator: string;
  coInvestigator?: string;
  projectPageContent: BlocksContent;
  projectStartDate: Date;
  ongoingProject: boolean;
  projectEndDate: Date | null;
  primaryInvestigatorEmail: string;
  coInvestigatorEmail?: string;
  projectPageCoverImage: FullStrapiImage | null;
}

/**
 * Gets singular research project
 */
export async function getResearchProject(documentId: string): Promise<ResearchProjectPageData | null> {
  try {
    const query = qs.stringify(
      {
        populate: '*',
      },
      {
        encodeValuesOnly: true,
      }
    );
    const res = await api.get(`/research-projects/${documentId}?${query}`);
    const projectData = res.data.data;
    let coverImage: FullStrapiImage | null = null;
    if (projectData.projectPageCoverImage){
      const image = projectData.projectPageCoverImage;
      coverImage = {
        id: image.id,
        alternativeText: image.alternativeText,
        url: image.url,
        width: image.width,
        height: image.height,
      }
    }
    return {
      title: projectData.title,
      primaryInvestigator: projectData.primaryInvestigator,
      coInvestigator: projectData.coInvestigator,
      projectPageContent: projectData.projectPageContent,
      projectStartDate: strapiDateToDate(projectData.projectStartDate),
      ongoingProject: projectData.ongoingProject,
      projectEndDate: projectData.projectEndDate === null ? null : strapiDateToDate(projectData.projectEndDate),
      primaryInvestigatorEmail: projectData.primaryInvestigatorEmail,
      secondaryInvestigatorEmail: projectData.secondaryInvestigatorEmail,
      projectPageCoverImage: coverImage,
    } as ResearchProjectPageData

  } catch (error) {
    console.error("Error fetching research project:", error);
    return null;
  }
}