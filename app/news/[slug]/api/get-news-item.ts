import { api } from "@/lib/api";
import qs from "qs";
import { z } from "zod";

const NewsItemSchema = z.object({
  title: z.string(),
  publishedAt: z.string(),
  author: z.string().nullable().optional(),
  abstract: z.string(),
  newsContent: z.string(),
  news_tags: z.array(z.object({ tagName: z.string() })).optional(),
  coverImage: z.object({
    url: z.string(),
    alternativeText: z.string().nullable(),
  }).nullable().optional(),
}).transform((item) => {
  const tags = (item.news_tags ?? []).map((t) => t.tagName).sort();
  return {
    title: item.title,
    publishDate: new Date(item.publishedAt),
    author: item.author ?? 'Unknown',
    abstract: item.abstract,
    newsContent: item.newsContent,
    newsTags: tags,
    coverImage: item.coverImage ?? null,
  };
});

export type NewsItemData = z.infer<typeof NewsItemSchema>;

export async function getNewsItem(documentId: string): Promise<NewsItemData | null> {
  try {
    const query = qs.stringify({ populate: '*' }, { encodeValuesOnly: true });
    const res = await api.get(`/news-items/${documentId}?${query}`);
    return NewsItemSchema.parse(res.data.data);
  } catch (e) {
    console.error("Error fetching news item:", e);
    return null;
  }
}
