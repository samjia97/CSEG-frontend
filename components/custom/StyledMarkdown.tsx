import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import React from "react";

interface StyledMarkdownProps {
  text: string;
  // Blog-only rich features: GFM tables + KaTeX math. Off by default so the
  // forum keeps the basic Markdown feature set.
  extended?: boolean;
}

const StyledMarkdown = ({ text, extended = false }: StyledMarkdownProps) => {
  return (
    <div className="prose max-w-none bg-neutral-50 p-4 prose-headings:font-normal prose-li:marker:text-black">
      <Markdown
        remarkPlugins={extended ? [remarkGfm, remarkMath] : []}
        rehypePlugins={extended ? [rehypeKatex] : []}
        components={
          extended
            ? {
                // Let wide tables scroll horizontally instead of overflowing the page.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                table: ({ node, ...props }: any) => (
                  <div className="overflow-x-auto">
                    <table {...props} />
                  </div>
                ),
                // Cap in-content images to the column width, lazy-load them, and
                // always give an alt (guards layout + the a11y lint).
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                img: ({ node, ...props }: any) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    {...props}
                    alt={props.alt ?? ""}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto h-auto max-w-full rounded"
                  />
                ),
              }
            : undefined
        }
      >
        {text}
      </Markdown>
    </div>
  );
};

export { StyledMarkdown };
