"use client"
import React, {useState} from 'react'
import {Publication} from "@/app/publications/api/get-publications";
import {formatDate} from "@/lib/formatters";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {PublicationsFilterPanel} from "@/app/publications/PublicationsFilterPanel";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";

type InteractivePublicationsProps = {
  initialPublications: Publication[],
  topics: string[]
}

function InteractivePublications({initialPublications, topics}: InteractivePublicationsProps) {
  const [publications, setPublications] = useState(initialPublications);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const query = (formData.get("search") as string).toLowerCase();
    if (query.length > 0) {

    }
  }


  return (
      <div className={"max-w-7xl w-full grid grid-cols-[220px_1fr] gap-4"}>
        <PublicationsFilterPanel
            setPublications={setPublications}
            initialPublications={initialPublications}
            topics={topics}
        />
        <div>
          <form className={"flex gap-2 w-full max-w-[450px] items-center"}>
            <Input type={"text"} name={"search"} placeholder={"search in title and author"} className={" w-full rounded-none focus-visible:ring-0"}/>
            <Button type={"submit"} aria-label={"Submit"} size={"icon"}><Search/></Button>
            <Button type={"reset"} variant={"destructive"}>CLEAR</Button>
          </form>
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
                    <Link href={item.linkToPublication} className={"underline"}>Link to
                      resource</Link>
                    :
                    <p>No link provided</p>
                }
              </div>)}
        </div>
      </div>
  )
}

export default InteractivePublications
