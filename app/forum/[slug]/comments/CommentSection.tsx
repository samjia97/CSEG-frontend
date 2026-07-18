"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/formatters";
import type { CommentNode } from "@/app/forum/[slug]/api/get-comments";

const MAX = 2000;

const REPORT_REASONS = [
  { value: "BAD_LANGUAGE", label: "Bad language" },
  { value: "DISCRIMINATION", label: "Discrimination" },
  { value: "OTHER", label: "Other" },
];

type Props = {
  threadDocumentId: string;
  initialComments: CommentNode[];
  loadError?: string | null;
};

function countComments(nodes: CommentNode[]): number {
  return nodes.reduce((acc, n) => acc + 1 + countComments(n.children), 0);
}

export function CommentSection({ threadDocumentId, initialComments, loadError }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function postComment(content: string, threadOf?: number): Promise<boolean> {
    setError(null);
    const trimmed = content.trim();
    if (!trimmed) {
      setError("Comment cannot be empty.");
      return false;
    }
    if (trimmed.length > MAX) {
      setError(`Max ${MAX} characters.`);
      return false;
    }

    const res = await fetch(`/api/forum-comments/${threadDocumentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: trimmed,
        ...(threadOf ? { threadOf } : {}),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const reason = data?.error?.message || `HTTP ${res.status}`;
      setError(`Couldn't post your comment (${reason}).`);
      return false;
    }
    router.refresh();
    return true;
  }

  async function reportComment(commentId: number, reason: string, content: string): Promise<boolean> {
    const res = await fetch(`/api/forum-comments/${threadDocumentId}/${commentId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, content }),
    });
    return res.ok;
  }

  return (
    <section className="mt-8 w-full">
      <h2 className="text-xl font-semibold mb-4">Replies ({countComments(initialComments)})</h2>

      {error && <div className="mb-3 p-2 bg-red-100 text-red-800 rounded text-sm">{error}</div>}

      <CommentForm
        placeholder="Write a reply to this thread…"
        submitLabel="Post reply"
        onSubmit={(content) => postComment(content)}
      />

      <div className="flex flex-col gap-4 mt-6">
        {loadError && (
          <div className="p-2 bg-amber-100 text-amber-900 rounded text-sm">{loadError}</div>
        )}
        {!loadError && initialComments.length === 0 && (
          <p className="text-neutral-500">No replies yet. Start the discussion above.</p>
        )}
        {initialComments.map((c) => (
          <CommentNodeView key={c.id} comment={c} onReply={postComment} onReport={reportComment} />
        ))}
      </div>
    </section>
  );
}

function CommentForm({
  placeholder,
  submitLabel,
  onSubmit,
}: {
  placeholder: string;
  submitLabel: string;
  onSubmit: (content: string) => Promise<boolean>;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handle() {
    setSubmitting(true);
    const ok = await onSubmit(content);
    setSubmitting(false);
    if (ok) setContent("");
  }

  return (
    <div className="space-y-2 max-w-[800px]">
      <Textarea
        placeholder={placeholder}
        className="min-h-20"
        maxLength={MAX}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button size="sm" disabled={submitting} onClick={handle}>
        {submitting ? "Posting…" : submitLabel}
      </Button>
    </div>
  );
}

function ReportForm({
  onSubmit,
}: {
  onSubmit: (reason: string, content: string) => Promise<boolean>;
}) {
  const [reason, setReason] = useState(REPORT_REASONS[0].value);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return <p className="mt-2 text-sm text-green-700">Thanks — this comment has been reported for review.</p>;
  }

  async function handle() {
    setSubmitting(true);
    setError(null);
    const content = note.trim() || REPORT_REASONS.find((r) => r.value === reason)?.label || "Reported";
    const ok = await onSubmit(reason, content);
    setSubmitting(false);
    if (ok) setDone(true);
    else setError("Couldn't submit the report. Please try again.");
  }

  return (
    <div className="mt-2 max-w-[500px] space-y-2 rounded border border-neutral-200 bg-neutral-50 p-2">
      <p className="text-sm font-medium">Report this comment</p>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm"
      >
        {REPORT_REASONS.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      <Textarea
        placeholder="Add a note (optional)"
        className="min-h-16"
        maxLength={500}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <Button size="sm" variant="outline" disabled={submitting} onClick={handle}>
        {submitting ? "Reporting…" : "Submit report"}
      </Button>
    </div>
  );
}

function CommentNodeView({
  comment,
  onReply,
  onReport,
}: {
  comment: CommentNode;
  onReply: (content: string, threadOf?: number) => Promise<boolean>;
  onReport: (commentId: number, reason: string, content: string) => Promise<boolean>;
}) {
  const [showReply, setShowReply] = useState(false);
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="border-l-2 border-neutral-200 pl-3">
      <div className="flex items-baseline gap-2">
        <span className="font-semibold">{comment.authorName}</span>
        <span className="text-sm text-neutral-500">{formatDate(new Date(comment.createdAt))}</span>
      </div>

      {comment.blocked ? (
        <p className="mt-1 italic text-neutral-400">[removed]</p>
      ) : (
        <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
      )}

      <div className="flex gap-3 mt-1">
        <button
          className="text-sm text-primary underline"
          onClick={() => setShowReply((v) => !v)}
        >
          {showReply ? "Cancel" : "Reply"}
        </button>
        <button
          className="text-sm text-neutral-500 underline"
          onClick={() => setShowReport((v) => !v)}
        >
          {showReport ? "Cancel report" : "Report"}
        </button>
      </div>

      {showReply && (
        <div className="mt-2">
          <CommentForm
            placeholder={`Reply to ${comment.authorName}…`}
            submitLabel="Post reply"
            onSubmit={async (content) => {
              const ok = await onReply(content, comment.id);
              if (ok) setShowReply(false);
              return ok;
            }}
          />
        </div>
      )}

      {showReport && (
        <ReportForm onSubmit={(reason, content) => onReport(comment.id, reason, content)} />
      )}

      {comment.children.length > 0 && (
        <div className="ml-4 mt-3 flex flex-col gap-3">
          {comment.children.map((child) => (
            <CommentNodeView key={child.id} comment={child} onReply={onReply} onReport={onReport} />
          ))}
        </div>
      )}
    </div>
  );
}
