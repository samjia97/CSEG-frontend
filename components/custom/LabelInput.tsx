"use client";
import React, { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

type LabelInputProps = {
  id?: string;
  options: string[];       // existing keyword names, for suggestions
  value: string[];         // selected keyword names (controlled)
  onChange: (names: string[]) => void;
  maxLabels?: number;      // default 5
  maxLength?: number;      // default 30 (label.labelName cap)
  allowCreate?: boolean;   // default true
  placeholder?: string;
  hint?: string;           // override helper text; pass "" to hide it
  inline?: boolean;        // render dropdown in normal flow (avoids clipping inside overflow containers)
};

const MAX_SUGGESTIONS = 8;

export function LabelInput({
  id,
  options,
  value,
  onChange,
  maxLabels = 5,
  maxLength = 30,
  allowCreate = true,
  placeholder = "Type to search or add a keyword…",
  hint,
  inline = false,
}: LabelInputProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim();
  const qLower = q.toLowerCase();
  const selectedLower = useMemo(() => new Set(value.map((v) => v.toLowerCase())), [value]);
  const atMax = value.length >= maxLabels;
  const hintText =
    hint !== undefined
      ? hint
      : atMax
        ? `Keyword limit reached (${maxLabels}).`
        : `Reuse an existing keyword when you can. Up to ${maxLabels} keywords, ${maxLength} characters each.`;

  // Existing keywords whose name starts with the query (case-insensitive), not already picked.
  const suggestions = useMemo(() => {
    if (!q) return [];
    return options
      .filter((name) => name.toLowerCase().startsWith(qLower) && !selectedLower.has(name.toLowerCase()))
      .slice(0, MAX_SUGGESTIONS);
  }, [options, q, qLower, selectedLower]);

  // Offer "Create" only when the label is genuinely new.
  const existsExact = options.some((name) => name.toLowerCase() === qLower);
  const canCreate =
    allowCreate && q.length > 0 && q.length <= maxLength && !existsExact && !selectedLower.has(qLower);
  const rowCount = suggestions.length + (canCreate ? 1 : 0);

  function addLabel(name: string) {
    const n = name.trim();
    if (!n || n.length > maxLength || value.length >= maxLabels) return;
    if (selectedLower.has(n.toLowerCase())) return;
    onChange([...value, n]);
    setQuery("");
    setActive(0);
    setOpen(false);
  }
  function removeLabel(name: string) {
    onChange(value.filter((v) => v !== name));
  }
  function commitActive() {
    if (active < suggestions.length) addLabel(suggestions[active]);
    else if (canCreate) addLabel(q);
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, Math.max(rowCount - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && rowCount > 0) {
        e.preventDefault();
        commitActive();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && !query && value.length > 0) {
      removeLabel(value[value.length - 1]);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
            >
              {name}
              <button
                type="button"
                aria-label={`Remove ${name}`}
                onClick={() => removeLabel(name)}
                className="rounded-full hover:bg-white/20"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {!atMax && (
        <div className="relative">
          <input
            id={id}
            ref={inputRef}
            type="text"
            value={query}
            maxLength={maxLength}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => query && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onKeyDown={onKeyDown}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400"
          />
          {open && q.length > 0 && (
            <ul
              role="listbox"
              className={
                (inline ? "" : "absolute z-10 ") +
                "mt-1 max-h-56 w-full overflow-auto rounded-md border border-neutral-200 bg-white py-1 shadow-md"
              }
            >
              {rowCount > 0 ? (
                <>
                  {suggestions.map((name, i) => (
                    <li key={name} role="option" aria-selected={i === active}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addLabel(name);
                        }}
                        onMouseEnter={() => setActive(i)}
                        className={
                          "block w-full px-3 py-1.5 text-left text-sm text-neutral-800 " +
                          (i === active ? "bg-neutral-100" : "hover:bg-neutral-50")
                        }
                      >
                        {name}
                      </button>
                    </li>
                  ))}
                  {canCreate && (
                    <li role="option" aria-selected={active === suggestions.length}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addLabel(q);
                        }}
                        onMouseEnter={() => setActive(suggestions.length)}
                        className={
                          "block w-full px-3 py-1.5 text-left text-sm text-neutral-800 " +
                          (active === suggestions.length ? "bg-neutral-100" : "hover:bg-neutral-50")
                        }
                      >
                        Create “<span className="font-medium">{q}</span>”
                      </button>
                    </li>
                  )}
                </>
              ) : (
                <li className="px-3 py-1.5 text-sm text-neutral-400">No matching keywords</li>
              )}
            </ul>
          )}
        </div>
      )}

      {hintText ? <p className="text-xs text-neutral-500">{hintText}</p> : null}
    </div>
  );
}
