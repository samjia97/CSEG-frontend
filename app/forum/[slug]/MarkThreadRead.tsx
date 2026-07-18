"use client";
import { useEffect, useRef } from "react";

/**
 * Marks this thread read for the current user on mount (fire-and-forget).
 * Renders nothing.
 */
export function MarkThreadRead({ threadDocumentId }: { threadDocumentId: string }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return; // guard React strict-mode double-invoke
    done.current = true;
    fetch("/api/thread-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadDocumentId }),
    }).catch(() => {
      // best-effort; a failed mark just leaves the thread showing as unread
    });
  }, [threadDocumentId]);
  return null;
}
