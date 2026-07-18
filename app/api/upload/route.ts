
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const STRAPI_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

// SVG is deliberately excluded — it can carry <script> and would run same-origin.
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // keep in sync with Strapi upload sizeLimit

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.strapiToken) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: { message: "Expected multipart form data." } }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: { message: "No file provided." } }, { status: 400 });
  }

  // Server-side guards — cannot be bypassed by the client.
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: { message: "Only PNG, JPEG, WebP or GIF images are allowed." } },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: { message: "Image must be 5 MB or smaller." } },
      { status: 413 }
    );
  }

  // Strapi's upload endpoint expects the field name "files".
  const upstream = new FormData();
  upstream.append("files", file, file.name);

  const strapiRes = await fetch(`${STRAPI_API}/upload`, {
    method: "POST",
    // Do NOT set Content-Type — fetch adds the multipart boundary automatically.
    headers: { Authorization: `Bearer ${session.user.strapiToken}` },
    body: upstream,
  });

  const result = await strapiRes.json().catch(() => null);
  if (!strapiRes.ok) {
    const message = result?.error?.message || `Upload failed (HTTP ${strapiRes.status}).`;
    return NextResponse.json({ error: { message } }, { status: strapiRes.status });
  }

  // Strapi returns an array of uploaded files; hand back just what the client needs.
  const uploaded = Array.isArray(result) ? result[0] : null;
  if (!uploaded?.id) {
    return NextResponse.json({ error: { message: "Unexpected upload response." } }, { status: 502 });
  }

  return NextResponse.json({ id: uploaded.id, url: uploaded.url, name: uploaded.name });
}
