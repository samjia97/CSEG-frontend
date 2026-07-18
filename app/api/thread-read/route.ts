
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const STRAPI_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.strapiToken) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const threadDocumentId = body?.threadDocumentId;
  if (typeof threadDocumentId !== "string" || !threadDocumentId) {
    return NextResponse.json({ error: { message: "threadDocumentId is required." } }, { status: 400 });
  }

  const strapiRes = await fetch(
    `${STRAPI_API}/thread-reads/mark/${encodeURIComponent(threadDocumentId)}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${session.user.strapiToken}` },
    }
  );

  const result = await strapiRes.json().catch(() => ({}));
  return NextResponse.json(result, { status: strapiRes.status });
}
