import {api} from "@/lib/api";
import {getSlug, strapiDateToDate} from "@/lib/utils";
import qs from "qs";

export type ResearchProject = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  summary: string;
  primaryInvestigator: string;
  coInvestigator?: string;
  projectPageContent: object[];
  projectStartDate: Date; // ISO 8601 date
  ongoingProject: boolean;
  projectEndDate: Date | null; // ISO 8601 date or null if ongoing
  primaryInvestigatorEmail: string;
  coInvestigatorEmail: string | null;
}

/**
 * Get all research projects
 * @return An array of ResearchProject objects or null if an error occurs
 */
export async function getResearchProjects(): Promise<ResearchProject[] | null> {
  try {
    const query = qs.stringify(
      {
        populate: '*',
        sort: ['projectStartDate:desc']
      },
      {
        encodeValuesOnly: true,
      }
    );
    const res = await api.get(`/research-projects?${query}`);
    const researchProjectsData = res.data.data;
    const researchProjects: ResearchProject[] = [];
    for (const project of researchProjectsData) {
      researchProjects.push({
        id: project.id,
        documentId: project.documentId,
        title: project.title ?? "Untitled Project",
        slug: project.title && project.documentId ? getSlug(project.title, project.documentId) : "Untitled Project",
        summary: project.summary ?? "",
        primaryInvestigator: project.primaryInvestigator ?? "",
        coInvestigator: project.coInvestigator ?? "",
        projectPageContent: project.projectPageContent ?? [],
        projectStartDate: strapiDateToDate(project.projectStartDate),
        ongoingProject: project.ongoingProject,
        projectEndDate: project.projectEndDate === null ? null : strapiDateToDate(project.projectEndDate),
        primaryInvestigatorEmail: project.primaryInvestigatorEmail,
        coInvestigatorEmail: project.secondaryInvestigatorEmail,
      });
    }
    return researchProjects
  } catch (error) {
    console.error("Error fetching research projects:", error);
    return null;
  }
}