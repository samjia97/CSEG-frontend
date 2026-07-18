"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownField } from "@/components/custom/MarkdownField";
import { LabelInput } from "@/components/custom/LabelInput";
import { useImageUpload } from "@/lib/upload-image";
import { Textarea } from "@/components/ui/textarea";
import type { TopicOption } from "@/lib/get-topics";

const TITLE_MAX = 200;

export function NewBlogForm({ topics, labels }: { topics: TopicOption[]; labels: string[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authorBio, setAuthorBio] = useState("");

  // Prefill the author bio from the member's account description (editable per post).
  useEffect(() => {
    const bio = session?.user?.description;
    if (bio) setAuthorBio((prev) => prev || bio);
  }, [session?.user?.description]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [labelNames, setLabelNames] = useState<string[]>([]);
  const [coverImageId, setCoverImageId] = useState<number | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error: coverError } = useImageUpload();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function toggleTopic(documentId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(documentId)) next.delete(documentId);
      else next.add(documentId);
      return next;
    });
  }

  async function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be re-picked after a Remove
    if (!file) return;
    const img = await upload(file); // sets `uploading` / `coverError` for us
    if (img) {
      setCoverImageId(img.id);
      setCoverPreview(img.absoluteUrl);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const t = title.trim();
    const b = body.trim();
    if (!t) {
      setError("Title is required.");
      return;
    }
    if (t.length > TITLE_MAX) {
      setError(`Title must be ${TITLE_MAX} characters or fewer.`);
      return;
    }
    if (!b) {
      setError("Body is required.");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: t,
        body: b,
        abstract,
        authorBio,
        tags: Array.from(selected),
        labels: labelNames,
        coverImageId, // number | null — attached to coverImage server-side
      }),
    });
    const data = await res.json().catch(() => null);
    setSubmitting(false);

    if (!res.ok) {
      const reason = data?.error?.message || `HTTP ${res.status}`;
      setError(`Couldn't submit the blog (${reason}).`);
      return;
    }

    // The blog is created as a draft (pending moderation), so it isn't public yet
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-[800px] rounded border border-green-300 bg-green-50 p-4">
        <h2 className="text-lg font-semibold text-green-800">Submitted for review</h2>
        <p className="mt-1 text-sm text-green-900">
          Thanks! Your blog has been sent to our team for moderation. We&apos;ll email you once
          it&apos;s published, or with feedback if changes are needed. It won&apos;t appear on the
          site until it&apos;s approved.
        </p>
        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setTitle("");
              setBody("");
              setAbstract("");
              setAuthorBio("");
              setSelected(new Set());
              setLabelNames([]);
              setCoverImageId(null);
              setCoverPreview(null);
              setError(null);
            }}
          >
            Write another
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/blog")}>
            Back to blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[800px] w-full">
      {error && <div className="p-2 bg-red-100 text-red-800 rounded text-sm">{error}</div>}

      <p className="text-xs text-neutral-500">
        Submissions are reviewed before they go live.
      </p>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <Input
          id="title"
          placeholder="Your blog title"
          maxLength={TITLE_MAX}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="abstract" className="text-sm font-medium">
          Abstract <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        <Textarea
            id="abstract"
            placeholder="A short summary shown on the blog list and at the top of your post."
            maxLength={500}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className="text-sm font-medium">Body</label>
        <MarkdownField
          id="body"
          placeholder="Write your blog — use the toolbar for formatting, tables, and math."
          value={body}
          onChange={setBody}
          extended
        />
      </div>



      <div className="flex flex-col gap-1">
        <label htmlFor="authorBio" className="text-sm font-medium">
          Author bio <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        <Textarea
          id="authorBio"
          placeholder="A short bio shown at the end of your post."
          maxLength={500}
          value={authorBio}
          onChange={(e) => setAuthorBio(e.target.value)}
        />
        <p className="text-xs text-neutral-500">
          Prefilled from your account description. Edits here apply only to this post.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cover" className="text-sm font-medium">
          Cover image <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        {coverPreview ? (
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverPreview}
              alt="Cover preview"
              className="max-h-48 w-auto rounded border border-neutral-200"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCoverImageId(null);
                setCoverPreview(null);
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div>
            <input
              ref={coverFileRef}
              id="cover"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleCoverSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => coverFileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Choose image"}
            </Button>
          </div>
        )}
        {coverError && <p className="mt-1 text-sm text-red-700">{coverError}</p>}
      </div>

      {topics.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            Topics <span className="text-neutral-400 font-normal">(optional)</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => {
              const isSelected = selected.has(topic.documentId);
              return (
                <button
                  key={topic.documentId}
                  type="button"
                  onClick={() => toggleTopic(topic.documentId)}
                  aria-pressed={isSelected}
                  className={
                    "rounded-full border px-3 py-1 text-sm transition-colors " +
                    (isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100")
                  }
                >
                  {topic.tagName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          Keywords <span className="text-neutral-400 font-normal">(optional)</span>
        </span>
        <LabelInput id="labels" options={labels} value={labelNames} onChange={setLabelNames} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting || uploading}>
          {submitting ? "Submitting…" : "Submit for review"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/blog")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
