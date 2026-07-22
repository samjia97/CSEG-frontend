/**
 * API Route to post new thread
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const STRAPI_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.strapiToken) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await req.json(); // { title, body, tags?: string[], postType? }

  const data: Record<string, unknown> = { title: body.title, body: body.body };
  if (body.bodyFormat === "plain" || body.bodyFormat === "markdown") {
    data.bodyFormat = body.bodyFormat;
  }
  if (Array.isArray(body.tags) && body.tags.length > 0) {
    data.forum_tags = body.tags; // event-tag documentIds
  }
  if (body.postType) data.postType = body.postType; // fixed enum: question/note/idea/collaborator
  // Author identity comes from the logged-in session, never the client.
  data.authorName = session.user.name ?? "";
  data.authorEmail = session.user.email ?? "";

  const strapiRes = await fetch(`${STRAPI_API}/forum-threads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.strapiToken}`,
    },
    body: JSON.stringify({ data }),
  });

  const result = await strapiRes.json();
  return NextResponse.json(result, { status: strapiRes.status });
}
