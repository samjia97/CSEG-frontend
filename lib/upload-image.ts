"use client";
import { getStrapiImageUrl } from "@/lib/api";
import { useCallback, useState } from "react";

export type UploadedImage = {
  id: number; // Strapi file id: used to attach the blog cover image
  url: string; // raw Strapi URL (relative on the local provider)
  name: string; // original filename
  absoluteUrl: string; // ready to embed in Markdown / use as <img src>
};

// Keep in sync with app/api/upload/route.ts
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Upload a single image through the authenticated /api/upload proxy.
 * Throws an Error with a user-facing message on failure.
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
  // Fast client-side checks for instant feedback; the proxy enforces the same rules.
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PNG, JPEG, WebP or GIF images are allowed.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const form = new FormData();
  form.append("file", file); // proxy expects the field name "file"

  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error?.message || `Upload failed (HTTP ${res.status}).`);
  }

  return {
    id: data.id,
    url: data.url,
    name: data.name,
    // Absolutise now so in-content Markdown works regardless of local vs cloud provider.
    absoluteUrl: getStrapiImageUrl(data.url),
  };
}

/**
 * React helper tracking uploading/error state around uploadImage().
 * upload(file) resolves to the UploadedImage, or null if it failed (see `error`).
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<UploadedImage | null> => {
    setError(null);
    setUploading(true);
    try {
      return await uploadImage(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error, clearError: () => setError(null) };
}
