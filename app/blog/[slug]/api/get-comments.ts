import { baseURL } from "@/lib/api";

export type CommentNode = {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
  blocked: boolean;
  children: CommentNode[];
};

export type CommentsResult = {
  comments: CommentNode[];
  error: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(raw: any): CommentNode {
  return {
    id: raw?.id,
    content: raw?.content ?? "",
    authorName: raw?.author?.name ?? "Anonymous",
    createdAt: raw?.createdAt ?? new Date().toISOString(),
    blocked: Boolean(raw?.blocked) || Boolean(raw?.removed),
    children: Array.isArray(raw?.children) ? raw.children.map(normalize) : [],
  };
}

export async function getComments(documentId: string, token: string): Promise<CommentsResult> {
  try {
    const relation = `api::blog.blog:${documentId}`;
    const res = await fetch(`${baseURL}/comments/${relation}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const reason = body?.error?.message || `HTTP ${res.status}`;
      return { comments: [], error: `Couldn't load comments (${reason}).` };
    }
    const json = await res.json();
    const arr = Array.isArray(json) ? json : json?.data ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { comments: (arr as any[]).map(normalize), error: null };
  } catch (e) {
    console.error("Error fetching comments:", e);
    return { comments: [], error: "Couldn't load comments (network error)." };
  }
}
