import React from 'react'
import {Publication} from "@/app/publications/api/get-publications";
import {formatDate} from "@/lib/formatters";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";

type InteractivePublicationsProps = {
  publications: Publication[];
}

function InteractivePublications({publications}: InteractivePublicationsProps) {
  return (
      <div className={"max-w-7xl w-full"}>
        InteractivePublications
        <div>
          {publications.map((item) =>
              <div key={item.id} className={"flex flex-col border-b border-neutral-500 py-2"}>
                <p className={"text-lg"}>{item.title}</p>
                <div className={"grid grid-cols-[150px_1fr]"}>
                  <strong>Author</strong>
                  <p>{item.author}</p>
                  <strong>Publication Date</strong>
                  <p>{formatDate(item.publicationDate)}</p>
                  <strong>Topics</strong>
                  <div className={"flex gap-2 pt-1"}>
                    {item.topics.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                  </div>
                </div>
                {item.linkToPublication ?
                <Link href={item.linkToPublication} className={"underline"}>Link to resource</Link>
                    :
                    <p>No link provided</p>
                }
              </div>)}
        </div>
      </div>
  )
}

export default InteractivePublications
