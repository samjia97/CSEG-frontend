import { api } from "@/lib/api";
import qs from "qs";
import { z } from "zod";

const BlogSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  publishedAt: z.string(),
  body: z.string(),
  bodyFormat: z.enum(["markdown", "plain"]).nullable().optional(),
  authorName: z.string().nullable().optional(),
  authorBio: z.string().nullable().optional(),
  blog_tags: z.array(z.object({ tagName: z.string() })).optional(),
  labels: z.array(z.object({ labelName: z.string() })).optional(),
  abstract: z.string().nullable().optional(),
  coverImage: z
    .object({
      alternativeText: z.string().nullable(),
      url: z.string(),
      width: z.number(),
      height: z.number(),
    })
    .nullable()
    .optional(),
}).transform((item) => {
  return {
    documentId: item.documentId,
    title: item.title,
    publishDate: new Date(item.publishedAt),
    body: item.body,
    bodyFormat: item.bodyFormat ?? "markdown",
    authorName: item.authorName ?? null,
    authorBio: item.authorBio ?? null,
    topics: (item.blog_tags ?? []).map((t) => t.tagName).sort(),
    labels: (item.labels ?? []).map((l) => l.labelName).sort(),
    abstract: item.abstract ?? null,
    coverImage: item.coverImage ?? null,
  };
});

export type BlogData = z.infer<typeof BlogSchema>;

export async function getBlog(documentId: string, token: string): Promise<BlogData | null> {
  try {
    const query = qs.stringify({ populate: "*" }, { encodeValuesOnly: true });
    const res = await api.get(`/blogs/${documentId}?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return BlogSchema.parse(res.data.data);
  } catch (e) {
    console.error("Error fetching blog:", e);
    return null;
  }
}
