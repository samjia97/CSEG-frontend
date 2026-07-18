"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownField } from "@/components/custom/MarkdownField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSlug } from "@/lib/utils";
import type { TopicOption } from "@/lib/get-topics";
import { POST_TYPE_OPTIONS, defaultPostType, type PostType } from "@/app/forum/forum_constants";

const TITLE_MAX = 200;

export function NewThreadForm({ topics }: { topics: TopicOption[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState<PostType>(defaultPostType);
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function toggleTopic(documentId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(documentId)) next.delete(documentId);
      else next.add(documentId);
      return next;
    });
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
      setError(`Title should not be longer than ${TITLE_MAX} characters.`);
      return;
    }
    if (!b) {
      setError("Body is required.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/forum-threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: t, body: b, tags: Array.from(selected), postType }),
    });
    const data = await res.json().catch(() => null);
    setSubmitting(false);

    if (!res.ok) {
      const reason = data?.error?.message || `HTTP ${res.status}`;
      setError(`Couldn't create the thread (${reason}).`);
      return;
    }

    const created = data?.data;
    if (created?.documentId) {
      router.push(`/forum/${getSlug(created.title ?? t, created.documentId)}`);
    } else {
      router.push("/forum");
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[800px] w-full">
      {error && <div className="p-2 bg-red-100 text-red-800 rounded text-sm">{error}</div>}

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <Input
          id="title"
          placeholder="What do you want to discuss?"
          maxLength={TITLE_MAX}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="postType" className="text-sm font-medium">Type</label>
        <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
          <SelectTrigger id="postType" variant="simple" className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {POST_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className="text-sm font-medium">Body</label>
        <MarkdownField
          id="body"
          placeholder="Write here — use the toolbar to format."
          value={body}
          onChange={setBody}
        />
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

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Create thread"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/forum")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
