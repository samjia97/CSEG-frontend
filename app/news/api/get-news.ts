import { baseURL } from "@/lib/api";
import qs from "qs";
import { z } from "zod";
import { getSlug } from "@/lib/utils";

const NewsSchema = z.array(
  z.object({
    id: z.number(),
    documentId: z.string(),
    title: z.string(),
    publishedAt: z.string(),
    author: z.string().nullable().optional(),
    abstract: z.string(),
    news_tags: z.array(z.object({ tagName: z.string() })).optional(),
  }).transform((item) => {
    const tags = (item.news_tags ?? []).map((t) => t.tagName).sort();
    return {
      id: item.id,
      title: item.title,
      slug: getSlug(item.title, item.documentId),
      publishDate: new Date(item.publishedAt),
      author: item.author ?? 'Unknown',
      abstract: item.abstract,
      newsTags: tags,
    };
  })
);

export type NewsCardData = z.infer<typeof NewsSchema>[number];

const MAX_RECORDS = 99999;

export async function getNews(): Promise<NewsCardData[]> {
  try {
    const query = qs.stringify(
      {
        fields: ['title', 'author', 'abstract', 'publishedAt'],
        populate: { news_tags: { fields: ['tagName'] } },
        sort: ['publishedAt:desc'],
        pagination: { pageSize: MAX_RECORDS },
      },
      { encodeValuesOnly: true }
    );
    const url = `${baseURL}/news-items?${query}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch news: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return NewsSchema.parse(data.data);
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : 'Unknown error loading news';
    throw new Error(message);
  }
}
