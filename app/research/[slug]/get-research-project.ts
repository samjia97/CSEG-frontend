import {api} from "@/lib/api";
import qs from "qs";
import z from "zod";


const ResearchProjectPageSchema = z.object({
  title: z.string(),
  primaryInvestigator: z.string(),
  coInvestigator: z.string().nullable(),
  projectPageContent: z.string(),
  projectStartDate: z.string(),
  ongoingProject: z.boolean(),
  projectEndDate: z.string().nullable(),
  primaryInvestigatorEmail: z.string(),
  coInvestigatorEmail: z.string().nullable(),
  projectPageCoverImage: z.object({
    id: z.number(),
    alternativeText: z.string().nullable(),
    url: z.string(),
    width: z.number(),
    height: z.number(),
  }).nullable(),
  research_topics: z.array(z.object({
    tagName: z.string()
  }))
}).transform((project) => {
  return {
    title: project.title,
    primaryInvestigator: project.primaryInvestigator,
    coInvestigator: project.coInvestigator,
    projectPageContent: project.projectPageContent,
    projectStartDate: new Date(project.projectStartDate),
    ongoingProject: project.ongoingProject,
    projectEndDate: project.projectEndDate ? new Date(project.projectEndDate) : null,
    primaryInvestigatorEmail: project.primaryInvestigatorEmail,
    coInvestigatorEmail: project.coInvestigatorEmail,
    projectPageCoverImage: project.projectPageCoverImage,
    researchTopics: project.research_topics?.map(x => x.tagName) ?? []
  };
});

export type ResearchProjectPage = z.infer<typeof ResearchProjectPageSchema>;

/**
 * Gets singular research project
 */
export async function getResearchProject(documentId: string): Promise<ResearchProjectPage> {
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
    return ResearchProjectPageSchema.parse(res.data.data);
  } catch (error) {
    console.error( error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to fetch research project with ID ${documentId}: ${message}`);
  }
}