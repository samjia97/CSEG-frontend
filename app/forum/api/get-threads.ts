import { baseURL } from "@/lib/api";
import qs from "qs";
import { z } from "zod";
import { getSlug } from "@/lib/utils";
import { PostTypeSchema, type PostType } from "@/app/forum/forum_constants";

// Strip common markdown so the card preview reads as plain text.
function toPlainText(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")        // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")      // links
    .replace(/```[\s\S]*?```/g, " ")              // fenced code blocks
    .replace(/`([^`]*)`/g, "$1")                  // inline code
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")           // headings
    .replace(/^\s{0,3}>\s?/gm, "")                // blockquotes
    .replace(/^\s{0,3}([-*+]|\d+\.)\s+/gm, "")    // list markers
    .replace(/[*_~]/g, "")                         // emphasis
    .replace(/\s+/g, " ")                          // collapse whitespace
    .trim();
}

const ThreadsSchema = z.array(
  z.object({
    id: z.number(),
    documentId: z.string(),
    title: z.string(),
    publishedAt: z.string(),
    body: z.string().optional(),
    forum_tags: z.array(z.object({ tagName: z.string() })).optional(),
    postType: z.string().nullable().optional(),
    authorName: z.string().nullable().optional(),
  }).transform((item) => {
    const plain = toPlainText(item.body ?? "");
    const excerpt = plain.length > 120 ? `${plain.slice(0, 120)}…` : plain;
    return {
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      slug: getSlug(item.title, item.documentId),
      publishDate: new Date(item.publishedAt),
      excerpt,
      topics: (item.forum_tags ?? []).map((t) => t.tagName).sort(),
      postType: PostTypeSchema.safeParse(item.postType).success ? (item.postType as PostType) : null,
      authorName: item.authorName ?? null,
    };
  })
);

type ThreadCardBase = z.infer<typeof ThreadsSchema>[number];
export type ThreadCardData = ThreadCardBase & {
  threadUnread: boolean;
  hasUnreadReply: boolean;
};

type ReadStatus = { reads: Record<string, string>; lastReplies: Record<string, string> };

const MAX_RECORDS = 99999;

// Per-user read state for the list. Returns null if the endpoint is unavailable
// (e.g. permission not granted) so the list degrades to "no indicators" rather
// than lighting every thread up red.
async function getReadStatus(token: string): Promise<ReadStatus | null> {
  try {
    const res = await fetch(`${baseURL}/thread-reads/status`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return { reads: json?.reads ?? {}, lastReplies: json?.lastReplies ?? {} };
  } catch {
    return null;
  }
}

export async function getThreads(token: string): Promise<ThreadCardData[]> {
  try {
    const query = qs.stringify(
      {
        fields: ["title", "publishedAt", "postType", "authorName", "body"],
        populate: "*",
        sort: ["publishedAt:desc"],
        pagination: { pageSize: MAX_RECORDS },
      },
      { encodeValuesOnly: true }
    );
    const url = `${baseURL}/forum-threads?${query}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      throw new Error(`Failed to fetch threads: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    const base = ThreadsSchema.parse(data.data);

    // Merge per-user read state → unread-thread + unread-reply flags.
    const status = await getReadStatus(token);
    return base.map((t) => {
      if (!status) return { ...t, threadUnread: false, hasUnreadReply: false };
      const readAt = status.reads[t.documentId]; // thread-read always keys by documentId
      // comments' `related` may key by documentId OR numeric id — try both.
      const lastReplyAt = status.lastReplies[t.documentId] ?? status.lastReplies[String(t.id)];
      return {
        ...t,
        threadUnread: !readAt,
        hasUnreadReply: !!lastReplyAt && (!readAt || lastReplyAt > readAt),
      };
    });
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Unknown error loading threads";
    throw new Error(message);
  }
}
