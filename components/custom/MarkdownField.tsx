"use client";
import React, { useRef, useState } from "react";
import { Bold, Italic, Heading2, List, Link as LinkIcon, Table as TableIcon, Sigma, Image as ImageIcon } from "lucide-react";
import { StyledMarkdown } from "@/components/custom/StyledMarkdown";
import { useImageUpload } from "@/lib/upload-image";

type MarkdownFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number; // px, default 160
  extended?: boolean; // enable table + math tools and rich preview (blogs only)
};

// Common symbols offered by the palette (inserted as literal Unicode characters).
const SYMBOLS = ["×", "÷", "±", "≤", "≥", "≠", "≈", "→", "∞", "π", "√", "θ", "α", "β", "λ", "μ", "°", "·", "∑", "∫"];

export function MarkdownField({ id, value, onChange, placeholder, minHeight = 160, extended = false }: MarkdownFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const { upload, uploading, error: imageError } = useImageUpload();

  // Wrap the selected text with markers (e.g. **bold**), or drop in a placeholder.
  function wrap(before: string, after: string, placeholderText: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const chosen = value.slice(s, e) || placeholderText;
    const next = value.slice(0, s) + before + chosen + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + chosen.length);
    });
  }

  // Add a line-prefix (e.g. "## " or "- ") to each selected line.
  function prefixLines(prefix: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const from = value.lastIndexOf("\n", s - 1) + 1;
    const block = value.slice(from, e);
    const out = block
      .split("\n")
      .map((l) => (l.startsWith(prefix) ? l : prefix + l))
      .join("\n");
    const next = value.slice(0, from) + out + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(from, from + out.length);
    });
  }

  // Insert plain text at the cursor (used by the symbol palette).
  function insertText(text: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const next = value.slice(0, s) + text + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = s + text.length;
      el.setSelectionRange(pos, pos);
    });
  }

  // Insert a block (e.g. a table) on its own lines.
  function insertBlock(text: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const before = value.slice(0, s);
    const after = value.slice(e);
    const prefix = before && !before.endsWith("\n") ? "\n\n" : "";
    const suffix = after && !after.startsWith("\n") ? "\n\n" : "";
    const block = prefix + text + suffix;
    onChange(before + block + after);
    requestAnimationFrame(() => {
      el.focus();
      const pos = before.length + block.length;
      el.setSelectionRange(pos, pos);
    });
  }

  // Upload an image and drop a Markdown reference to it (own block) at the cursor.
  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    const img = await upload(file); // sets `uploading` / `imageError` for us
    if (!img) return; // failure already surfaced via imageError
    const alt = img.name.replace(/\.[^.]+$/, "").replace(/[[\]]/g, "").trim() || "image";
    insertBlock(`![${alt}](${img.absoluteUrl})`);
  }

  const tools = [
    { key: "b", label: "Bold", Icon: Bold, run: () => wrap("**", "**", "bold text") },
    { key: "i", label: "Italic", Icon: Italic, run: () => wrap("*", "*", "italic text") },
    { key: "h", label: "Heading", Icon: Heading2, run: () => prefixLines("## ") },
    { key: "l", label: "List", Icon: List, run: () => prefixLines("- ") },
    { key: "a", label: "Link", Icon: LinkIcon, run: () => wrap("[", "](https://)", "link text") },
    ...(extended
      ? [
          {
            key: "table",
            label: "Table",
            Icon: TableIcon,
            run: () => insertBlock("| Column 1 | Column 2 |\n| --- | --- |\n| Cell | Cell |"),
          },
          {
            key: "math",
            label: "Math formula (inline, e.g. $a^2 + b^2$)",
            Icon: Sigma,
            run: () => wrap("$", "$", "a^2 + b^2"),
          },
        ]
      : []),
  ];

  return (
    <div className="rounded-md border border-neutral-300 bg-white">
      <div className="flex items-center gap-0.5 border-b border-neutral-200 px-2 py-1">
        {tools.map((t) => (
          <button
            key={t.key}
            type="button"
            title={t.label}
            aria-label={t.label}
            disabled={preview || uploading}
            onClick={t.run}
            className="rounded p-1.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
          >
            <t.Icon size={16} />
          </button>
        ))}

        {extended && (
          <>
            <button
              type="button"
              title="Insert image"
              aria-label="Insert image"
              disabled={preview || uploading}
              onClick={() => fileRef.current?.click()}
              className="rounded p-1.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
            >
              <ImageIcon size={16} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleImageSelect}
              className="hidden"
            />
          </>
        )}

        {extended && (
          <div className="relative">
            <button
              type="button"
              title="Insert symbol"
              aria-label="Insert symbol"
              disabled={preview || uploading}
              onClick={() => setShowSymbols((v) => !v)}
              className="rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
            >
              Ω
            </button>
            {showSymbols && !preview && (
              <div className="absolute left-0 z-10 mt-1 grid w-56 grid-cols-5 gap-1 rounded-md border border-neutral-200 bg-white p-2 shadow-md">
                {SYMBOLS.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    // onMouseDown so it fires before the textarea loses focus.
                    onMouseDown={(ev) => {
                      ev.preventDefault();
                      insertText(sym);
                      setShowSymbols(false);
                    }}
                    className="rounded px-2 py-1 text-sm text-neutral-800 hover:bg-neutral-100"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {uploading && <span className="ml-1 text-xs text-neutral-500">Uploading…</span>}

        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="ml-auto rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-100"
        >
          {preview ? "Write" : "Preview"}
        </button>
      </div>

      {imageError && (
        <p className="border-b border-neutral-200 px-3 py-1 text-sm text-red-700">{imageError}</p>
      )}

      {preview ? (
        <div className="px-1 py-1" style={{ minHeight }}>
          {value.trim() ? (
            <StyledMarkdown text={value} extended={extended} />
          ) : (
            <p className="p-3 text-sm text-neutral-400">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <textarea
          id={id}
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={(ev) => onChange(ev.target.value)}
          disabled={uploading}
          style={{ minHeight }}
          className="w-full resize-y bg-transparent px-3 py-2 text-sm outline-none disabled:opacity-60"
        />
      )}
    </div>
  );
}
