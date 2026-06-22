"use client"
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/custom/SearchBar";
import {
  Pagination,
  PaginationClientLink,
  PaginationClientNext,
  PaginationClientPrevious,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { NewsFilterPanel } from "@/app/news/newsFilterPanel";
import { NewsSortBy } from "@/app/news/newsSortBy";
import {
  defaultEndDate,
  defaultSortOption,
  defaultStartDate,
  defaultTimePeriod,
  PAGE_SIZE,
  SortOption,
  SortOptionSchema,
  TimePeriod,
  TimePeriodSchema,
} from "@/app/news/news_constants";
import { NewsCardData } from "@/app/news/api/get-news";

type InteractiveNewsProps = {
  initialNews: NewsCardData[];
  topics: string[];
};

function parseDateParam(value: string | null, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? fallback : parsed;
}

function formatDateParam(date: Date): string {
  return date.toISOString().split("T")[0];
}

const matchesSearch = (item: NewsCardData, query: string): boolean => {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    item.title.toLowerCase().includes(q) ||
    item.author.toLowerCase().includes(q)
  );
};

const matchesTimePeriod = (
  item: NewsCardData,
  timePeriod: TimePeriod,
  customStart: Date,
  customEnd: Date,
  now: Date
): boolean => {
  const date = item.publishDate;
  const twelveMonthsAgo = new Date(now);
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

  switch (timePeriod) {
    case "recent":
      return date >= twelveMonthsAgo;
    case "custom":
      return date >= customStart && date <= customEnd;
    case "all":
    default:
      return true;
  }
};

const matchesTopics = (item: NewsCardData, selected: Set<string>): boolean => {
  if (selected.size === 0) return true;
  return item.newsTags.some((tag) => selected.has(tag));
};

const sortNews = (items: NewsCardData[], sortOption: SortOption): NewsCardData[] => {
  const sorted = [...items];
  switch (sortOption) {
    case "publishDate:desc":
      return sorted.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
    case "publishDate:asc":
      return sorted.sort((a, b) => a.publishDate.getTime() - b.publishDate.getTime());
    case "title:asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title:desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
};

const NoNewsMessage = () => (
  <div className="py-4 w-full bg-accent text-accent-foreground rounded-md text-center">
    <h4>No news to show</h4>
    <p>Please change your filter / search settings</p>
  </div>
);

export function InteractiveNews({ initialNews, topics }: InteractiveNewsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timePeriodResult = TimePeriodSchema.safeParse(searchParams.get("timePeriod"));
  const timePeriod = timePeriodResult.success ? timePeriodResult.data : defaultTimePeriod;

  const topicsParam = searchParams.get("topics") ?? "";
  const selectedTopics = new Set<string>(
    topicsParam ? topicsParam.split(",").filter((t) => topics.includes(t)) : []
  );

  const customStartDate = parseDateParam(searchParams.get("startDate"), defaultStartDate);
  const customEndDate = parseDateParam(searchParams.get("endDate"), defaultEndDate);

  const searchQuery = searchParams.get("query") ?? "";

  const sortResult = SortOptionSchema.safeParse(searchParams.get("sort"));
  const sortOption: SortOption = sortResult.success ? sortResult.data : defaultSortOption;

  const pageParam = parseInt(searchParams.get("page") ?? "1");
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    if (!("page" in updates)) params.delete("page");
    router.replace(`/news?${params.toString()}`);
  };

  const filteredAndSorted = useMemo(() => {
    const now = new Date();
    const filtered = initialNews.filter(
      (item) =>
        matchesSearch(item, searchQuery) &&
        matchesTimePeriod(item, timePeriod, customStartDate, customEndDate, now) &&
        matchesTopics(item, selectedTopics)
    );
    return sortNews(filtered, sortOption);
  }, [initialNews, searchQuery, timePeriod, customStartDate, customEndDate, selectedTopics, sortOption]);

  const maxPage = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);
  const paginated = filteredAndSorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-2 items-start mt-2 max-w-7xl w-full">
      <div className={`grid w-full gap-4 ${isFilterOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`}>
        {isFilterOpen && (
          <NewsFilterPanel
            topics={topics}
            timePeriod={timePeriod}
            selectedTopics={selectedTopics}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            updateParams={updateParams}
            formatDateParam={formatDateParam}
          />
        )}

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-4">
            <NewsSortBy currentSort={sortOption} onSortChange={(sort) => updateParams({ sort: sort === defaultSortOption ? null : sort })} />
            <div className="flex gap-2">
              <SearchBar onSearch={(q) => updateParams({ query: q || null })} placeholder="Search by title or author" />
              <Button type="button" variant="destructive" onClick={() => router.replace("/news")}>
                CLEAR
              </Button>
            </div>
          </div>

          {paginated.length === 0 ? (
            <NoNewsMessage />
          ) : (
            paginated.map((item) => (
              <div key={item.id} className="drop-shadow-md shadow bg-neutral-100 px-4 pb-1">
                <Link href={`/news/${item.slug}`} className="text-xl">
                  <span className="text-primary underline">{item.title}</span>
                </Link>
                <div className="grid grid-cols-[80px_1fr]">
                  <strong>Date</strong>
                  <p className="inline">{formatDate(item.publishDate)}</p>
                  <strong>Author</strong>
                  <p className="inline">{item.author}</p>
                  <strong>Summary</strong>
                  <p className="inline">{item.abstract}</p>
                  {item.newsTags.length > 0 && (
                    <>
                      <strong className="pt-1">Topics</strong>
                      <div className="flex gap-2 pt-1 flex-wrap">
                        {item.newsTags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationClientPrevious onClick={() => {
                  if (safePage > 1) {
                    const params = new URLSearchParams(searchParams.toString());
                    if (safePage - 1 === 1) params.delete("page");
                    else params.set("page", String(safePage - 1));
                    router.push(`/news?${params.toString()}`);
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
                      router.push(`/news?${params.toString()}`);
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
                    router.push(`/news?${params.toString()}`);
                  }
                }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
