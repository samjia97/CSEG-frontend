/**
 * API Route to post new blog
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const STRAPI_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.strapiToken) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await req.json(); // { title, body, abstract?, tags?, labels?, coverImageId? }

  const data: Record<string, unknown> = { title: body.title, body: body.body };
  if (body.bodyFormat === "plain" || body.bodyFormat === "markdown") {
    data.bodyFormat = body.bodyFormat;
  }
  if (typeof body.abstract === "string" && body.abstract.trim()) {
    data.abstract = body.abstract.trim();
  }
  if (typeof body.authorBio === "string" && body.authorBio.trim()) {
    data.authorBio = body.authorBio.trim();
  }
  if (Array.isArray(body.tags) && body.tags.length > 0) {
    data.blog_tags = body.tags; // event-tag documentIds (existing Topics — unchanged)
  }
  // Author identity comes from the logged-in session.
  data.authorName = session.user.name ?? "";
  data.authorEmail = session.user.email ?? "";

  const payload: Record<string, unknown> = { data };
  if (Array.isArray(body.labels) && body.labels.length > 0) {
    payload.labelNames = body.labels; // resolved to labels in the blog controller
  }
  if (typeof body.coverImageId === "number") {
    payload.coverImageId = body.coverImageId; // → coverImage in the blog controller
  }

  const strapiRes = await fetch(`${STRAPI_API}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.strapiToken}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await strapiRes.json();
  return NextResponse.json(result, { status: strapiRes.status });
}
