/**
 * API Route to post a comment
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const STRAPI_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const session = await auth();
  if (!session?.user?.strapiToken) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { documentId } = await params;
  const relation = `api::blog.blog:${documentId}`;

  const body = await req.json(); // { content, threadOf? }
  // Authorship is derived from the JWT by the comments plugin.
  const payload: Record<string, unknown> = { content: body.content };
  if (body.threadOf) payload.threadOf = body.threadOf;

  const strapiRes = await fetch(`${STRAPI_API}/comments/${relation}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.strapiToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await strapiRes.json();
  return NextResponse.json(data, { status: strapiRes.status });
}
