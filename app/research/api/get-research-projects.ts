import {api} from "@/lib/api";
import {getSlug, strapiDateToDate} from "@/lib/utils";
import qs from "qs";
import {z} from "zod";


const ResearchProjectSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  title: z.string(),
  summary: z.string(),
  primaryInvestigator: z.string(),
  coInvestigator: z.string().nullable(),
  projectStartDate: z.string(),
  ongoingProject: z.boolean(),
  projectEndDate: z.string().nullable(),
  primaryInvestigatorEmail: z.string(),
  coInvestigatorEmail: z.string().nullable(),
  research_topics: z.array(z.object({
    tagName: z.string()
  }))
}).transform((project) => {
  return {
    id: project.id,
    documentId: project.documentId,
    title: project.title,
    slug: project.title && project.documentId ? getSlug(project.title, project.documentId) : "",
    summary: project.summary,
    primaryInvestigator: project.primaryInvestigator,
    coInvestigator: project.coInvestigator ?? "",
    projectStartDate: strapiDateToDate(project.projectStartDate),
    ongoingProject: project.ongoingProject,
    projectEndDate: project.projectEndDate === null ? null : strapiDateToDate(project.projectEndDate),
    primaryInvestigatorEmail: project.primaryInvestigatorEmail,
    coInvestigatorEmail: project.coInvestigatorEmail,
    researchTopics: project.research_topics.map((t) => t.tagName)
  };
});

export type ResearchProject = z.infer<typeof ResearchProjectSchema>;


/**
 * Get all research projects
 * @return An array of ResearchProject objects or null if an error occurs
 */
export async function getResearchProjects(): Promise<ResearchProject[]> {
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
    const researchProjects = res.data.data.map((project: unknown) => ResearchProjectSchema.parse(project));
    return researchProjects;
  } catch (error) {
    const message = error instanceof  Error ? error.message : 'Unkown error'
    console.error("Error fetching research projects:", error);
    throw new Error(message);
  }
}