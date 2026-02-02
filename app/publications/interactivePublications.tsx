"use client"
import React, {useMemo, useState} from 'react'
import {Publication} from "@/app/publications/api/get-publications";
import {formatDate} from "@/lib/formatters";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {PublicationsFilterPanel} from "@/app/publications/PublicationsFilterPanel";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search, Settings2} from "lucide-react";
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

const NoPublicationsToShow = () => {
  return (
      <div className="py-4 w-full max-w-5xl bg-accent text-accent-foreground rounded-md text-center">
        <h4>No publications to show</h4>
        <p>Please change your filter / search settings</p>
      </div>
  )
}

function InteractivePublications({initialPublications, topics}: InteractivePublicationsProps) {
  const [startYear, setStartYearState] = useState(defaultStartYear);
  const [endYear, setEndYearState] = useState(String(thisYear));
  const [selectedTopics, setSelectedTopicsState] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isFilterOpen, setIsFilterOpen] = useState(true); // Filters shown by default

  // Wrapper setters that also reset page to 1 (avoids useEffect cascading renders)
  const setStartYear: typeof setStartYearState = (value) => {
    setStartYearState(value);
    setPage(1);
  };
  const setEndYear: typeof setEndYearState = (value) => {
    setEndYearState(value);
    setPage(1);
  };
  const setSelectedTopics: typeof setSelectedTopicsState = (value) => {
    setSelectedTopicsState(value);
    setPage(1);
  };

  /**
   * Processes search query and resets page to 1
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const query = formData.get("search")?.toString() ?? ''
    setSearchQuery(query.toLowerCase());
    setPage(1);
  }

  /**
   * Clears everything: search query AND all filters, resets page to 1
   */
  const handleClearAll = () => {
    setSearchQuery("");
    setStartYearState(defaultStartYear);
    setEndYearState(String(thisYear));
    setSelectedTopicsState(new Set());
    setPage(1);
  }

  const filteredPublications = useMemo(() => {
    const endYearDate = new Date(parseInt(endYear, 10), 11, 31)
    const startYearDate = new Date(parseInt(startYear, 10), 0, 1)
    return initialPublications.filter((value) =>
        value.publicationDate <= endYearDate &&
        value.publicationDate >= startYearDate &&
        (selectedTopics.size === 0 || value.topics.some((topic) => selectedTopics.has(topic))) &&
        validateAgainstQuery(value, searchQuery)
    );
  }, [initialPublications, endYear, startYear, searchQuery, selectedTopics])

  const maxPage = Math.ceil(filteredPublications.length / PAGE_SIZE);
  const paginatedPublications = filteredPublications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
      <div className={`grid gap-4 ${isFilterOpen ? 'grid-cols-[220px_1fr]' : 'grid-cols-1'}`}>
        {/* Side filter panel - conditionally rendered */}
        {isFilterOpen && (
          <PublicationsFilterPanel
              topics={topics}
              startYear={startYear}
              setStartYear={setStartYear}
              endYear={endYear}
              setEndYear={setEndYear}
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
          />
        )}

        {/* Main content */}
        <div>
          {/* Search bar with filter toggle */}
          <form className="flex gap-2 w-full items-center" onSubmit={handleSubmit}>
            {/*<Button*/}
            {/*    type="button"*/}
            {/*    variant="outline"*/}
            {/*    aria-label={isFilterOpen ? "Hide filters" : "Show filters"}*/}
            {/*    onClick={() => setIsFilterOpen(!isFilterOpen)}*/}
            {/*>*/}
            {/*  <Settings2 />*/}
            {/*  Filters*/}
            {/*</Button>*/}
            <Input
              type="text"
              name="search"
              placeholder="search in title and author"
              className="flex-1 max-w-[350px] rounded-none focus-visible:ring-0"
            />
            <Button type="submit" aria-label="Submit" size="icon">
              <Search />
            </Button>
            <Button type="reset" variant="destructive" onClick={handleClearAll}>
              CLEAR
            </Button>

          </form>

          {/* Results */}
          <div className="mt-3 mb-3 max-w-3xl">
            {paginatedPublications.length === 0 ?
                <NoPublicationsToShow />
                :
                paginatedPublications.map((item) =>
                    <div key={item.id} className="flex flex-col border-b border-neutral-500 pb-2">
                      <p className="text-lg">{item.title}</p>
                      <div className="grid grid-cols-[150px_1fr]">
                        <strong>Author</strong>
                        <p>{item.author}</p>
                        <strong>Publication Date</strong>
                        {
                          item.onPress ? <p>On press (not yet published)</p> :
                          <p>{formatDate(item.publicationDate)}</p>
                        }
                        {
                          item.topics.length > 0 && <>
                              <strong>Topics</strong>
                              <div className="flex gap-2 pt-1 flex-wrap">
                                {item.topics.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                              </div>
                            </>
                        }

                      </div>
                      {item.linkToPublication &&
                          <Link href={item.linkToPublication} className="underline">
                            Link to resource
                          </Link>
                      }
                    </div>)
            }
          </div>

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationClientPrevious onClick={() => setPage(Math.max(1, page - 1))} />
              </PaginationItem>
              {Array.from({length: maxPage}, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationClientLink
                        onClick={() => setPage(i + 1)}
                        isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationClientLink>
                  </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationClientNext onClick={() => setPage(Math.min(maxPage, page + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
  )
}

export default InteractivePublications
