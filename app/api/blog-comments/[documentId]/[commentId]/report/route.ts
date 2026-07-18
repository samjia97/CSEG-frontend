/**
 * API Route to report a comment
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const STRAPI_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string; commentId: string }> }
) {
  const session = await auth();
  if (!session?.user?.strapiToken) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { documentId, commentId } = await params;
  const relation = `api::blog.blog:${documentId}`;
  const body = await req.json(); // { reason, content }

  const strapiRes = await fetch(
    `${STRAPI_API}/comments/${relation}/comment/${commentId}/report-abuse`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.strapiToken}`,
      },
      body: JSON.stringify({ reason: body.reason, content: body.content }),
    }
  );

  const data = await strapiRes.json();
  return NextResponse.json(data, { status: strapiRes.status });
}
