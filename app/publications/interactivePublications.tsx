"use client"
import React, { useMemo, useState } from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Publication } from "@/app/publications/api/get-publications";
import { formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicationsFilterPanel } from "@/app/publications/PublicationsFilterPanel";
import SearchBar from "@/components/custom/SearchBar";
import {
  Pagination,
  PaginationClientLink,
  PaginationClientNext,
  PaginationClientPrevious,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  defaultEndYear,
  defaultStartYear,
  PAGE_SIZE,
  YearSchema,
} from "@/app/publications/publication_constants";

type InteractivePublicationsProps = {
  initialPublications: Publication[];
  topics: string[];
};

/**
 * Filter publications based on search query (title, author)
 */
const matchesQuery = (publication: Publication, query: string): boolean => {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    publication.title.toLowerCase().includes(q) ||
    publication.author.toLowerCase().includes(q)
  );
};

/**
 * Returns true if the publication matches any of the selected topics.
 */
const matchesTopics = (publication: Publication, selectedTopics: Set<string>): boolean => {
  if (selectedTopics.size === 0) return true;
  return publication.topics.some((t) => selectedTopics.has(t));
};

const NoPublicationsToShow = () => (
  <div className="py-4 w-full max-w-5xl bg-accent text-accent-foreground rounded-md text-center">
    <h4>No publications to show</h4>
    <p>Please change your filter / search settings</p>
  </div>
);

/**
 * Client-side interactive publications with filtering, search, and pagination.
 * All filter state is stored in URL search params so it survives navigation.
 */
function InteractivePublications({ initialPublications, topics }: InteractivePublicationsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---- Read ALL filter state from URL with Zod validation ----

  const startYearResult = YearSchema.safeParse(searchParams.get("startYear"));
  const startYear = startYearResult.success ? startYearResult.data : defaultStartYear;

  const endYearResult = YearSchema.safeParse(searchParams.get("endYear"));
  const endYear = endYearResult.success ? endYearResult.data : defaultEndYear;

  const topicsParam = searchParams.get("topics") ?? "";
  const selectedTopics = new Set<string>(
    topicsParam ? topicsParam.split(",").filter((t) => topics.includes(t)) : []
  );

  const searchQuery = searchParams.get("query") ?? "";

  const pageParam = parseInt(searchParams.get("page") ?? "1");
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // UI-only state (doesn't need to persist in URL)
  const [isFilterOpen] = useState(true);

  // ---- Helper: update URL search params ----
  // Pass the params you want to change. null/empty removes the param.
  // Automatically resets page to 1 unless you're changing page itself.
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    // Reset page to 1 when any filter (not page itself) changes
    if (!("page" in updates)) {
      params.delete("page");
    }
    router.replace(`/publications?${params.toString()}`);
  };

  // ---- Client-side filtering with useMemo for performance ----
  const filteredPublications = useMemo(() => {
    const startDate = new Date(parseInt(startYear, 10), 0, 1);
    const endDate = new Date(parseInt(endYear, 10), 11, 31);
    return initialPublications.filter((p) =>
      p.publicationDate >= startDate &&
      p.publicationDate <= endDate &&
      matchesTopics(p, selectedTopics) &&
      matchesQuery(p, searchQuery)
    );
  }, [initialPublications, startYear, endYear, selectedTopics, searchQuery]);

  // Pagination
  const maxPage = Math.max(1, Math.ceil(filteredPublications.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);
  const paginatedPublications = filteredPublications.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ---- Handlers ----
  const handleSearch = (query: string) => {
    updateParams({ query: query || null });
  };

  const handleClearAll = () => {
    router.replace("/publications");
  };

  return (
    <div className={`grid gap-4 ${isFilterOpen ? 'grid-cols-[220px_1fr]' : 'grid-cols-1'}`}>
      {/* Filter Panel - conditionally rendered */}
      {isFilterOpen && (
        <PublicationsFilterPanel
          topics={topics}
          startYear={startYear}
          endYear={endYear}
          selectedTopics={selectedTopics}
          updateParams={updateParams}
        />
      )}

      {/* Main Content */}
      <div>
        {/* Search and Controls */}
        <div className="flex gap-2 w-full items-center">
          <SearchBar onSearch={handleSearch} placeholder="search in title and author" />
          <Button type="button" variant="destructive" onClick={handleClearAll}>
            CLEAR
          </Button>
        </div>

        {/* Publications List */}
        <div className="mt-3 mb-3 max-w-3xl">
          {paginatedPublications.length === 0 ? (
            <NoPublicationsToShow />
          ) : (
            paginatedPublications.map((item) => (
              <div key={item.id} className="flex flex-col border-b border-neutral-500 pb-2">
                <p className="text-lg">{item.title}</p>
                <div className="grid grid-cols-[150px_1fr]">
                  <strong>Author</strong>
                  <p>{item.author}</p>
                  <strong>Publication Date</strong>
                  <p>{formatDate(item.publicationDate)}</p>
                  {item.topics.length > 0 && (
                    <>
                      <strong>Topics</strong>
                      <div className="flex gap-2 pt-1 flex-wrap">
                        {item.topics.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                      </div>
                    </>
                  )}
                </div>
                {item.linkToPublication && (
                  <Link href={item.linkToPublication} className="underline" target="_blank">
                    Link to resource
                  </Link>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination - uses router.push so back button returns to previous page */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationClientPrevious onClick={() => {
                if (safePage > 1) {
                  const params = new URLSearchParams(searchParams.toString());
                  if (safePage - 1 === 1) params.delete("page");
                  else params.set("page", String(safePage - 1));
                  router.push(`/publications?${params.toString()}`);
                }
              }} />
            </PaginationItem>
            {Array.from({ length: maxPage }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationClientLink
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (i + 1 === 1) params.delete("page");
                    else params.set("page", String(i + 1));
                    router.push(`/publications?${params.toString()}`);
                  }}
                  isActive={safePage === i + 1}
                >
                  {i + 1}
                </PaginationClientLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationClientNext onClick={() => {
                if (safePage < maxPage) {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(safePage + 1));
                  router.push(`/publications?${params.toString()}`);
                }
              }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default InteractivePublications;
