import { baseURL } from "@/lib/api";
import qs from "qs";
import { z } from "zod";
import { getSlug } from "@/lib/utils";

const BlogsSchema = z.array(
  z.object({
    id: z.number(),
    documentId: z.string(),
    title: z.string(),
    publishedAt: z.string(),
    authorName: z.string().nullable().optional(),
    blog_tags: z.array(z.object({ tagName: z.string() })).optional(),
    labels: z.array(z.object({ labelName: z.string() })).optional(),
    abstract: z.string().nullable().optional(),
    coverImage: z
      .object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
        alternativeText: z.string().nullable(),
      })
      .nullable()
      .optional(),
  }).transform((item) => {
    return {
      id: item.id,
      title: item.title,
      slug: getSlug(item.title, item.documentId),
      publishDate: new Date(item.publishedAt),
      authorName: item.authorName ?? null,
      topics: (item.blog_tags ?? []).map((t) => t.tagName).sort(),
      labels: (item.labels ?? []).map((l) => l.labelName).sort(),
      abstract: item.abstract ?? null,
      coverImage: item.coverImage ?? null,
    };
  })
);

export type BlogCardData = z.infer<typeof BlogsSchema>[number];

const MAX_RECORDS = 99999;

export async function getBlogs(token: string): Promise<BlogCardData[]> {
  try {
    const query = qs.stringify(
      {
        fields: ["title", "publishedAt", "authorName", "abstract"],
        populate: "*",
        sort: ["publishedAt:desc"],
        pagination: { pageSize: MAX_RECORDS },
      },
      { encodeValuesOnly: true }
    );
    const url = `${baseURL}/blogs?${query}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return BlogsSchema.parse(data.data);
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Unknown error loading blogs";
    throw new Error(message);
  }
}
