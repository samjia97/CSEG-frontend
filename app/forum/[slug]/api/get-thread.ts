import { api } from "@/lib/api";
import qs from "qs";
import { z } from "zod";
import { PostTypeSchema, type PostType } from "@/app/forum/forum_constants";

const ThreadSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  publishedAt: z.string(),
  body: z.string(),
  forum_tags: z.array(z.object({ tagName: z.string() })).optional(),
  postType: z.string().nullable().optional(),
  authorName: z.string().nullable().optional(),
}).transform((item) => {
  return {
    documentId: item.documentId,
    title: item.title,
    publishDate: new Date(item.publishedAt),
    body: item.body,
    topics: (item.forum_tags ?? []).map((t) => t.tagName).sort(),
    postType: PostTypeSchema.safeParse(item.postType).success ? (item.postType as PostType) : null,
    authorName: item.authorName ?? null,
  };
});

export type ThreadData = z.infer<typeof ThreadSchema>;

export async function getThread(documentId: string, token: string): Promise<ThreadData | null> {
  try {
    const query = qs.stringify({ populate: "*" }, { encodeValuesOnly: true });
    const res = await api.get(`/forum-threads/${documentId}?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return ThreadSchema.parse(res.data.data);
  } catch (e) {
    console.error("Error fetching thread:", e);
    return null;
  }
}
