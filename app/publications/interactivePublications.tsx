"use client"
import React, {useEffect, useMemo, useState} from 'react'
import {Publication} from "@/app/publications/api/get-publications";
import {formatDate} from "@/lib/formatters";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {PublicationsFilterPanel} from "@/app/publications/PublicationsFilterPanel";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {defaultStartYear, PAGE_SIZE, thisYear} from "@/app/publications/publication_constants";
import {
  Pagination,
  PaginationClientLink,
  PaginationClientNext,
  PaginationClientPrevious,
  PaginationContent,
  PaginationItem
} from "@/components/ui/pagination";

type InteractivePublicationsProps = {
  initialPublications: Publication[],
  topics: string[]
};

const validateAgainstQuery = (publication: Publication, query: string): boolean => {
  return publication.title.toLowerCase().includes(query) || publication.author.toLowerCase().includes(query);
}

function InteractivePublications({initialPublications, topics}: InteractivePublicationsProps) {
  const [startYear, setStartYear] = useState(defaultStartYear);
  const [endYear, setEndYear] = useState(String(thisYear));
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);


  /**
   * Processes search query
   * @param e
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const query = formData.get("search")?.toString() ?? ''
    setSearchQuery(query.toLowerCase());
  }
  /**
   * Clears search query in action.
   */
  const handleReset = () => {
    setSearchQuery("");
  }



  const filteredPublications = useMemo(()=>{
    const endYearDate = new Date(parseInt(endYear, 10), 11, 31)
    const startYearDate = new Date(parseInt(startYear, 10), 0, 1)
    return initialPublications.filter((value) =>
        value.publicationDate <= endYearDate &&
        value.publicationDate >= startYearDate &&
        (selectedTopics.size === 0 || selectedTopics.difference(new Set(value.topics)).size === 0) &&
        validateAgainstQuery(value, searchQuery)
    );
  }, [initialPublications, endYear, startYear, searchQuery, selectedTopics])

  useEffect(() => {setPage(1)}, [searchQuery, startYear, endYear, selectedTopics]);
  const maxPage = Math.ceil(filteredPublications.length / PAGE_SIZE);
  const paginatedPublications = filteredPublications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)


  if (initialPublications.length === 0){
    return (
        <div className="py-4 w-full max-w-5xl bg-accent text-accent-foreground rounded-md text-center">
          <h4>No publications to show</h4>
        </div>
    )
  }
  return (
      <div className={"grid grid-cols-[220px_1fr] gap-4"}>
        <PublicationsFilterPanel
            initialPublications={initialPublications}
            topics={topics}
            startYear={startYear}
            setStartYear={setStartYear}
            endYear={endYear}
            setEndYear={setEndYear}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
        />
        <div>
          <form className={"flex gap-2 w-full max-w-[450px] items-center"} onSubmit={handleSubmit}>
            <Input type={"text"} name={"search"} placeholder={"search in title and author"} className={" w-full rounded-none focus-visible:ring-0"}/>
            <Button type={"submit"} aria-label={"Submit"} size={"icon"}><Search/></Button>
            <Button type={"reset"} variant={"destructive"} onClick={handleReset}>CLEAR</Button>
          </form>
          <div className={"mt-1 mb-3"}>

          {paginatedPublications.map((item) =>
              <div key={item.id} className={"flex flex-col border-b border-neutral-500 mb-2"}>
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
                {item.linkToPublication &&
                    <Link href={item.linkToPublication} className={"underline"}>Link to
                      resource</Link>
                }

              </div>)}
          </div>
          <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationClientPrevious onClick={() => setPage(Math.max(1, page - 1))} />
              </PaginationItem>

              {Array.from({length: maxPage},(_, i) => <PaginationItem key={i+1}><PaginationClientLink onClick={() => {
                setPage(i+1)}}
               isActive={page===i+1}>{i+1}</PaginationClientLink></PaginationItem>)}

              <PaginationItem>
                <PaginationClientNext  onClick={() => setPage(Math.min(maxPage, page + 1))}/>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          </div>
        </div>
      </div>
  )
}

export default InteractivePublications

