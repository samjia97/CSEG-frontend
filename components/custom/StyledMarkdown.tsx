import Markdown from "react-markdown";
import React from "react";
interface StyledMarkdownProps {
  text: string;
}

const StyledMarkdown = ({text}: StyledMarkdownProps) => {
  return (
      <div className={"prose max-w-none bg-neutral-50 p-4 prose-headings:font-normal prose-li:marker:text-black"}>
        <Markdown
        >{text}</Markdown>
      </div>
  )
}

export {StyledMarkdown}