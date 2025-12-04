import {api} from "@/lib/api";
import qs from "qs";
import {z} from "zod";

/**
 * {
 *     "data": [
 *         {
 *             "id": 3,
 *             "documentId": "uxx3niygy1v8ox6bi2f27yll",
 *             "tagName": "Pedagogy"
 *         },
 *         {
 *             "id": 5,
 *             "documentId": "mqb45o6dz9rdwoueugb7rs00",
 *             "tagName": "Curriculum Design"
 *         },
 *         {
 *             "id": 7,
 *             "documentId": "zn0sfkuu6y7h9ojsrzbs2hh4",
 *             "tagName": "Assessment"
 *         },
 *         {
 *             "id": 9,
 *             "documentId": "spzi0sqgm3bq293c1pgdwv3p",
 *             "tagName": "Student Misconceptions"
 *         },
 *         {
 *             "id": 11,
 *             "documentId": "jlux9cd9yy0bq3opn2qug6vy",
 *             "tagName": "Programming Education"
 *         },
 *         {
 *             "id": 13,
 *             "documentId": "rp40dsab3ghybbez3ygdiw25",
 *             "tagName": "Academic Writing"
 *         },
 *         {
 *             "id": 15,
 *             "documentId": "wofx8if4innpj6h86z8pekm7",
 *             "tagName": "CSE Literature"
 *         },
 *         {
 *             "id": 17,
 *             "documentId": "p5l91pndopf217t0w5x6a1v6",
 *             "tagName": "Primary Education (P1-P7)"
 *         },
 *         {
 *             "id": 19,
 *             "documentId": "fq32j9mdl2l3z7ewgiu23isf",
 *             "tagName": "Secondary Education (S1-S6)"
 *         },
 *         {
 *             "id": 21,
 *             "documentId": "koo5k56x6ec5r6nb7bya7c6g",
 *             "tagName": "Higher Education"
 *         },
 *         {
 *             "id": 23,
 *             "documentId": "sav8l8141q294qb7l23bvo51",
 *             "tagName": "Generative AI"
 *         },
 *         {
 *             "id": 25,
 *             "documentId": "q1vxjpjxbmh7h8p9o1htqz3t",
 *             "tagName": "Critical thinking"
 *         },
 *         {
 *             "id": 27,
 *             "documentId": "gotm2i94vqxtl7n0u2vixp8s",
 *             "tagName": "Ethics"
 *         },
 *         {
 *             "id": 29,
 *             "documentId": "i9bu4c6spy99dq1yvf5g2ao6",
 *             "tagName": "Accessibility and Inclusion"
 *         },
 *         {
 *             "id": 31,
 *             "documentId": "kpd4i0ysitkeax4obm0gwhay",
 *             "tagName": "Group projects"
 *         },
 *         {
 *             "id": 34,
 *             "documentId": "wjmns8fq3dowuspkvi17cqcl",
 *             "tagName": "Collaborative Learning"
 *         },
 *         {
 *             "id": 36,
 *             "documentId": "g6byr5or91rtpznexzgl2crv",
 *             "tagName": "Online & Hybrid Teaching"
 *         },
 *         {
 *             "id": 38,
 *             "documentId": "vsvrw15h67bysq6tuj4vm465",
 *             "tagName": "Industry Collaboration"
 *         },
 *         {
 *             "id": 40,
 *             "documentId": "bpob412p1jkql84pysjcpabn",
 *             "tagName": "Student Research"
 *         },
 *         {
 *             "id": 42,
 *             "documentId": "s7vmxq1y4q9wpe7yr9w264t0",
 *             "tagName": "Faculty Development"
 *         }
 *     ],
 *     "meta": {
 *         "pagination": {
 *             "page": 1,
 *             "pageSize": 25,
 *             "pageCount": 1,
 *             "total": 20
 *         }
 *     }
 * }
 */

const TopicSchema = z.object({
  tagName: z.string(),
});

const TopicResponseSchema = z.object({
  data: z.array(TopicSchema)
})

// type TopicsFromSchema = z.infer<typeof TopicResponseSchema>

/**
 * Returns name of all topics. Topics are also called event_tags
 * throws error if failed to get topics
 */
export async function getTopics(): Promise<string[]> {
  const query = {
    fields: ["tagName"]
  }
  const param = qs.stringify(query);
  const res = await api.get('/event-tags?' + param);
  const parsed = TopicResponseSchema.parse(res.data);
  // TODO: Type the topics
  const parsedTopics = parsed.data
  const topics = parsedTopics.map((item) => item.tagName)
  topics.sort();
  return topics;
}