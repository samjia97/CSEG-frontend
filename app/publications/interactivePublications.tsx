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
};

const validateAgainstQuery = (publication: Publication, query: string): boolean => {
  return publication.title.toLowerCase().includes(query) || publication.author.toLowerCase().includes(query);
}

function InteractivePublications({initialPublications, topics}: InteractivePublicationsProps) {
  const [publications, setPublications] = useState(initialPublications);
  const [startYear, setStartYear] = useState(defaultStartYear);
  const [endYear, setEndYear] = useState(String(thisYear));
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

  /**
   * Processes search query
   * @param e
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const query = (formData.get("search") as string).toLowerCase();
    setSearchQuery(query.toLowerCase());
  }
  /**
   * Clears search query in action.
   */
  const handleReset = () => {
    setSearchQuery("");
  }

  console.log('initialPublications', initialPublications);
  const filteredPublications = initialPublications.filter((value) =>
            value.publicationDate <= new Date(parseInt(endYear, 10), 11, 31) &&
            value.publicationDate >= new Date(parseInt(startYear, 10), 0, 1) &&
            (selectedTopics.size === 0 || selectedTopics.difference(new Set(value.topics)).size === 0) &&
            validateAgainstQuery(value, searchQuery)
  );
  console.log('applied filters', {startYear, endYear, selectedTopics}, 'filteredPublications', filteredPublications);

  return (
      <div className={"max-w-7xl w-full grid grid-cols-[220px_1fr] gap-4"}>
        <PublicationsFilterPanel
            setPublications={setPublications}
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
          {filteredPublications.map((item) =>
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
export const defaultStartYear = "2022";
export const thisYear = new Date().getFullYear();
const generateYearArray = (): number[] => {
  const yearArray = [];
  const startYearInt = parseInt(defaultStartYear);
  for (let i = thisYear; i >= startYearInt; i--) {
    yearArray.push(i);
  }
  return yearArray
}
export const yearArray = generateYearArray();