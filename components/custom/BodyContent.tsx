import { StyledMarkdown } from "@/components/custom/StyledMarkdown";

/**
 * Renders a post body according to its stored format:
 * - "plain": literal text, line breaks preserved, no Markdown parsing (React escapes HTML).
 * - anything else ("markdown", or legacy null): rendered as Markdown.
 */
export function BodyContent({
  text,
  format,
  extended = false,
}: {
  text: string;
  format?: string | null;
  extended?: boolean;
}) {
  if (format === "plain") {
    return <div className="whitespace-pre-wrap break-words">{text}</div>;
  }
  return <StyledMarkdown text={text} extended={extended} />;
}
