import {api} from "@/lib/api";
/**
 * Takes data from join-form.tsx to send to backend in format
 * {
 *   "data": {
 *     "fullName": "Dr. Elizabeth Chen",
 *     "preferredName": "Liz",
 *     "affiliations": "University of Edinburgh, School of Informatics",
 *     "email": "e.chen@ed.ac.uk",
 *     "aboutYou": "Senior lecturer in computer science education with a focus on inclusive pedagogy and curriculum design. Passionate about improving CS education access for underrepresented groups.",
 *     "topics": "Computer Science Education, Inclusive Teaching, Curriculum Design, Pedagogy Research",
 *     "willingnessToVolunteer": "yes-internally"
 *   }
 * }
 */
export type ApplicationData = {
  fullName: string;
  preferredName?: string;
  affiliations?: string;
  email: string;
  aboutYou: string;
  topics: string;
  willingnessToVolunteer: 'yes-internally' | 'yes-externally' | 'no';
};
export default async function createApplication(applicationData: ApplicationData){
  const res = await api.post('member-applications', {data: applicationData});
  console.debug(res.data, res.status)
}