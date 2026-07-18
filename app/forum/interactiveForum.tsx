"use client";
import React, { useMemo } from "react";
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
import { ForumFilterPanel } from "@/app/forum/forumFilterPanel";
import { ForumSortBy } from "@/app/forum/forumSortBy";
import {
  defaultEndDate,
  defaultSortOption,
  defaultStartDate,
  defaultTimePeriod,
  PAGE_SIZE,
  POST_TYPE_OPTIONS,
  POST_TYPE_LABELS,
  SortOption,
  SortOptionSchema,
  TimePeriod,
  TimePeriodSchema,
} from "@/app/forum/forum_constants";
import { ThreadCardData } from "@/app/forum/api/get-threads";

type InteractiveForumProps = {
  initialThreads: ThreadCardData[];
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

const matchesSearch = (item: ThreadCardData, query: string): boolean => {
  if (!query) return true;
  return item.title.toLowerCase().includes(query.toLowerCase());
};

const matchesTimePeriod = (
  item: ThreadCardData,
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

const matchesTopics = (item: ThreadCardData, selected: Set<string>): boolean => {
  if (selected.size === 0) return true;
  return item.topics.some((tag) => selected.has(tag));
};

const matchesPostType = (item: ThreadCardData, selected: Set<string>): boolean => {
  if (selected.size === 0) return true;
  return item.postType != null && selected.has(item.postType);
};

const sortThreads = (items: ThreadCardData[], sortOption: SortOption): ThreadCardData[] => {
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

const NoThreadsMessage = () => (
  <div className="py-4 w-full bg-accent text-accent-foreground rounded-md text-center">
    <h4>No discussions to show</h4>
    <p>Please change your filter / search settings</p>
  </div>
);

export function InteractiveForum({ initialThreads, topics }: InteractiveForumProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timePeriodResult = TimePeriodSchema.safeParse(searchParams.get("timePeriod"));
  const timePeriod = timePeriodResult.success ? timePeriodResult.data : defaultTimePeriod;

  const topicsParam = searchParams.get("topics") ?? "";
  const selectedTopics = new Set<string>(
    topicsParam ? topicsParam.split(",").filter((t) => topics.includes(t)) : []
  );

  const postTypeParam = searchParams.get("postType") ?? "";
  const validTypes = new Set<string>(POST_TYPE_OPTIONS.map((o) => o.value));
  const selectedPostTypes = new Set<string>(
    postTypeParam ? postTypeParam.split(",").filter((t) => validTypes.has(t)) : []
  );

  const customStartDate = parseDateParam(searchParams.get("startDate"), defaultStartDate);
  const customEndDate = parseDateParam(searchParams.get("endDate"), defaultEndDate);

  const searchQuery = searchParams.get("query") ?? "";

  const sortResult = SortOptionSchema.safeParse(searchParams.get("sort"));
  const sortOption: SortOption = sortResult.success ? sortResult.data : defaultSortOption;

  const pageParam = parseInt(searchParams.get("page") ?? "1");
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

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
    router.replace(`/forum?${params.toString()}`);
  };

  // Clicking a post-type badge on a card adds it to the active filter.
  const applyPostType = (value: string) => {
    const next = new Set(selectedPostTypes);
    next.add(value);
    updateParams({ postType: Array.from(next).join(",") });
  };

  // Clicking a topic on a card adds it to the active topic filter.
  const applyTopic = (topic: string) => {
    const next = new Set(selectedTopics);
    next.add(topic);
    updateParams({ topics: Array.from(next).join(",") });
  };

  const filteredAndSorted = useMemo(() => {
    const now = new Date();
    const filtered = initialThreads.filter(
      (item) =>
        matchesSearch(item, searchQuery) &&
        matchesTimePeriod(item, timePeriod, customStartDate, customEndDate, now) &&
        matchesTopics(item, selectedTopics) &&
        matchesPostType(item, selectedPostTypes)
    );
    return sortThreads(filtered, sortOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialThreads, searchQuery, timePeriod, customStartDate, customEndDate, topicsParam, postTypeParam, sortOption]);

  const maxPage = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);
  const paginated = filteredAndSorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-2 items-start mt-2 max-w-7xl w-full">
      <div className="grid w-full gap-4 grid-cols-[220px_1fr]">
        <ForumFilterPanel
          topics={topics}
          timePeriod={timePeriod}
          selectedTopics={selectedTopics}
          selectedPostTypes={selectedPostTypes}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          updateParams={updateParams}
          formatDateParam={formatDateParam}
        />

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[320px] max-w-full">
              <SearchBar onSearch={(q) => updateParams({ query: q || null })} placeholder="Search in title" />
            </div>
            <Button type="button" variant="destructive" onClick={() => router.replace("/forum")}>
              Reset
            </Button>
            <div className="ml-auto">
              <ForumSortBy
                currentSort={sortOption}
                onSortChange={(sort) => updateParams({ sort: sort === defaultSortOption ? null : sort })}
              />
            </div>
          </div>

          {paginated.length === 0 ? (
            <NoThreadsMessage />
          ) : (
            paginated.map((item) => {
              const pt = item.postType;
              return (
                <div
                  key={item.id}
                  className={
                    "drop-shadow-md shadow px-4 py-2 " +
                    (item.threadUnread ? "bg-[#ffe4e6]" : "bg-neutral-100")
                  }
                >
                  <div className="flex items-center gap-2">
                    {item.hasUnreadReply && (
                      <span
                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-red-500"
                        title="Unread replies"
                        aria-label="Unread replies"
                      />
                    )}
                    <Link href={`/forum/${item.slug}`} className="text-xl">
                      <span className="underline text-primary">
                        {item.title}
                      </span>
                    </Link>
                  </div>
                  <div className="mt-1">
                    <div className="flex flex-wrap items-center gap-x-2">
                      {item.authorName && (
                        <>
                          <span>{item.authorName}</span>
                          <span aria-hidden>-</span>
                        </>
                      )}
                      <span>{formatDate(item.publishDate)}</span>
                    </div>
                    {item.topics.length > 0 && (
                      <div className="flex gap-2 pt-1 flex-wrap">
                        {item.topics.map((tag) => (
                          <Badge key={tag} asChild>
                            <button
                              type="button"
                              onClick={() => applyTopic(tag)}
                              title={`Filter by “${tag}”`}
                              className="cursor-pointer hover:opacity-80"
                            >
                              {tag}
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    {pt && (
                      <div className="flex gap-2 pt-1 flex-wrap">
                        <Badge asChild variant="secondary">
                          <button
                            type="button"
                            onClick={() => applyPostType(pt)}
                            title={`Filter by ${POST_TYPE_LABELS[pt]}`}
                            className="cursor-pointer hover:opacity-80"
                          >
                            {POST_TYPE_LABELS[pt]}
                          </button>
                        </Badge>
                      </div>
                    )}
                  </div>
                  {item.excerpt && (
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{item.excerpt}</p>
                  )}
                </div>
              );
            })
          )}

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationClientPrevious
                  onClick={() => {
                    if (safePage > 1) {
                      const params = new URLSearchParams(searchParams.toString());
                      if (safePage - 1 === 1) params.delete("page");
                      else params.set("page", String(safePage - 1));
                      router.push(`/forum?${params.toString()}`);
                    }
                  }}
                />
              </PaginationItem>
              {Array.from({ length: maxPage }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationClientLink
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      if (i + 1 === 1) params.delete("page");
                      else params.set("page", String(i + 1));
                      router.push(`/forum?${params.toString()}`);
                    }}
                    isActive={safePage === i + 1}
                  >
                    {i + 1}
                  </PaginationClientLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationClientNext
                  onClick={() => {
                    if (safePage < maxPage) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("page", String(safePage + 1));
                      router.push(`/forum?${params.toString()}`);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
