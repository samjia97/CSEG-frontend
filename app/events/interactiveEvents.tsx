"use client"
import React, {useMemo, useState} from 'react'
import {EventCardData} from "@/app/events/api/get-events";
import Link from "next/link";
import {formatDate} from "@/lib/formatters";
import {Badge} from "@/components/ui/badge";
import {FilterPanel} from "@/app/events/filterPanel";
import {
  Pagination,
  PaginationClientLink,
  PaginationClientNext,
  PaginationClientPrevious,
  PaginationContent,
  PaginationItem
} from "@/components/ui/pagination";
import {SortBy} from "@/app/events/sortBy";
import {Button} from "@/components/ui/button";
import SearchBar from "@/components/custom/SearchBar";
import {
  defaultEndDate,
  defaultStartDate,
  defaultTimePeriod,
  defaultSortOption,
  EventType,
  EventTypeSchema,
  OpenTo,
  OpenToSchema,
  PAGE_SIZE,
  SortOption,
  SortOptionSchema,
  TimePeriod,
  TimePeriodSchema,
} from "@/app/events/event_constants";
import {useRouter, useSearchParams} from "next/navigation";

export const OPEN_TO_OPTIONS = ['Public', 'Member', 'Associate Member', 'Student Member'] as const;
export const EVENT_TYPE_OPTIONS = ['Teaching Hour', 'Reading Group', 'Workshop', 'Big Event', 'Other'] as const;

type InteractiveEventsProps = {
  initialEvents: EventCardData[];
  topics: string[];
}

/**
 * Filter events based on search query (title, speaker, summary)
 */
const matchesSearch = (event: EventCardData, query: string): boolean => {
  if (!query) return true;
  const lowerQuery = query.toLowerCase();
  return (
      event.title.toLowerCase().includes(lowerQuery) ||
      event.speaker.toLowerCase().includes(lowerQuery)
      // (event.summary?.toLowerCase() || "").includes(lowerQuery)
  );
}

/**
 * Filter events based on time period
 * Note: 'now' is passed in to avoid creating Date object for every event
 */
const matchesTimePeriod = (
    event: EventCardData,
    timePeriod: TimePeriod,
    customStartDate: Date,
    customEndDate: Date,
    now: Date
): boolean => {
  const eventDate = event.eventStartDateTime;

  switch (timePeriod) {
    case 'upcoming':
      return eventDate >= now;
    case 'past':
      return eventDate < now;
    case 'all':
      return true;
    case 'custom':
      return eventDate >= customStartDate && eventDate <= customEndDate;
    default:
      return true;
  }
}

/**
 * Filter events based on openTo. Returns events open to at least one of the
 * selected membership types.
 */
const matchesOpenTo = (event: EventCardData, openTo: Set<OpenTo>): boolean => {
  if (openTo.size === 0) return true;

  for (const selection of openTo) {
    if (selection === 'Public') {
      if (event.publicEvent) return true;
    } else if (!event.publicEvent && event.openTo.includes(selection)) {
      // Membership types apply only to non-public events. A public event's
      // open_to data is ignored everywhere else in the UI (shown as "Public"),
      // so the filter must ignore it too — otherwise a public event carrying a
      // stale open_to value wrongly matches other filters.
      return true;
    }
  }
  return false;
}

/**
 * Filter events based on event type. Empty selection = show all.
 */
const matchesEventType = (event: EventCardData, selectedTypes: Set<EventType>): boolean => {
  if (selectedTypes.size === 0) return true;
  return selectedTypes.has(event.eventType as EventType);
}

/**
 * Returns true if the project matches any of the selected topics.
 */
const matchesTopics = (event: EventCardData, selectedTopics: Set<string>): boolean => {
  if (selectedTopics.size === 0) return true;
  return event.eventTags.some(topic => selectedTopics.has(topic));
}

/**
 * Sort events based on sort option
 */
const sortEvents = (events: EventCardData[], sortOption: SortOption): EventCardData[] => {
  const sorted = [...events];
  switch (sortOption) {
    case 'eventDate:desc':
      return sorted.sort((a, b) => b.eventStartDateTime.getTime() - a.eventStartDateTime.getTime());
    case 'eventDate:asc':
      return sorted.sort((a, b) => a.eventStartDateTime.getTime() - b.eventStartDateTime.getTime());
    case 'title:asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title:desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

const NoEventsMessage = () => (
    <div className="py-4 w-full bg-accent text-accent-foreground rounded-md text-center">
      <h4>No events to show</h4>
      <p>Please change your filter / search settings</p>
    </div>
);

/** Parse a date from a URL param string (YYYY-MM-DD), returning fallback on failure */
function parseDateParam(value: string | null, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? fallback : parsed;
}

/** Format a Date as YYYY-MM-DD for URL params */
export function formatDateParam(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Client-side interactive events with filtering, search, and pagination.
 * All filter state is stored in URL search params so it survives navigation.
 */
export function InteractiveEvents({initialEvents, topics}: InteractiveEventsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---- Read ALL filter state from URL with Zod validation ----

  const timePeriodResult = TimePeriodSchema.safeParse(searchParams.get("timePeriod"));
  const timePeriod = timePeriodResult.success ? timePeriodResult.data : defaultTimePeriod;

  const openToParam = searchParams.get("openTo") ?? "";
  const openTo = new Set<OpenTo>(
      openToParam
          ? (openToParam.split(",").filter(v => OpenToSchema.safeParse(v).success) as OpenTo[])
          : []
  );

  const eventTypeParam = searchParams.get("eventType") ?? "";
  const selectedEventTypes = new Set<EventType>(
      eventTypeParam
          ? (eventTypeParam.split(",").filter(v => EventTypeSchema.safeParse(v).success) as EventType[])
          : []
  );

  const topicsParam = searchParams.get("topics") ?? "";
  const selectedTopics = new Set<string>(
      topicsParam ? topicsParam.split(",").filter(t => topics.includes(t)) : []
  );

  const customStartDate = parseDateParam(searchParams.get("startDate"), defaultStartDate);
  const customEndDate = parseDateParam(searchParams.get("endDate"), defaultEndDate);

  const searchQuery = searchParams.get("query") ?? "";

  const sortResult = SortOptionSchema.safeParse(searchParams.get("sort"));
  const sortOption: SortOption = sortResult.success ? sortResult.data : defaultSortOption;

  const pageParam = parseInt(searchParams.get("page") ?? "1");
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // UI-only state (doesn't need to persist in URL)
  const [isFilterOpen, setIsFilterOpen] = useState(true);

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
    router.replace(`/events?${params.toString()}`);
  };

  // ---- Client-side filtering with useMemo for performance ----
  const filteredAndSortedEvents = useMemo(() => {
    const now = new Date();

    const filtered = initialEvents.filter(event =>
        matchesSearch(event, searchQuery) &&
        matchesTimePeriod(event, timePeriod, customStartDate, customEndDate, now) &&
        matchesOpenTo(event, openTo) &&
        matchesEventType(event, selectedEventTypes) &&
        matchesTopics(event, selectedTopics)
    );
    return sortEvents(filtered, sortOption);
  }, [initialEvents, searchQuery, timePeriod, customStartDate, customEndDate, openTo, selectedEventTypes, selectedTopics, sortOption]);

  // Pagination
  const maxPage = Math.max(1, Math.ceil(filteredAndSortedEvents.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);
  const paginatedEvents = filteredAndSortedEvents.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ---- Handlers ----
  const handleSearch = (query: string) => {
    updateParams({query: query || null});
  };

  const handleSortChange = (sort: SortOption) => {
    updateParams({sort: sort === defaultSortOption ? null : sort});
  };

  const handleClearAll = () => {
    router.replace("/events");
  };

  return (
      <div className="flex flex-col gap-2 items-start mt-2 max-w-7xl w-full">
        <div
            className={`grid w-full gap-4 ${isFilterOpen ? 'grid-cols-[220px_1fr]' : 'grid-cols-1'}`}>
          {/* Filter Panel - conditionally rendered */}
          {isFilterOpen && (
              <FilterPanel
                  topics={topics}
                  timePeriod={timePeriod}
                  openTo={openTo}
                  eventTypes={selectedEventTypes}
                  selectedTopics={selectedTopics}
                  customStartDate={customStartDate}
                  customEndDate={customEndDate}
                  updateParams={updateParams}
                  formatDateParam={formatDateParam}
              />
          )}

          {/* Main Content */}
          <div className="flex flex-col gap-4 w-full">
            {/* Search and Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-[320px] max-w-full">
                <SearchBar onSearch={handleSearch} placeholder="search in title, summary or speaker"/>
              </div>
              <Button
                  type="button"
                  variant="destructive"
                  onClick={handleClearAll}
              >
                CLEAR
              </Button>
              <div className="ml-auto">
                <SortBy currentSort={sortOption} onSortChange={handleSortChange}/>
              </div>
            </div>


            {/* Events List */}
            {paginatedEvents.length === 0 ? (
                <NoEventsMessage/>
            ) : (
                paginatedEvents.map((item) => {
                  const dateString = formatDate(item.eventStartDateTime);
                  const startTimeString = item.eventStartString;
                  const endTimeString = item.eventEndString;

                  return (
                      <div key={item.id} className="drop-shadow-md shadow bg-neutral-100 px-4 pb-1">
                        {/* Event title */}
                        <Link href={`/events/${item.slug}`} className="text-xl">
                          <span className="text-accent no-underline">[{item.eventType}]</span>{" "}
                          <span className="text-primary underline">{item.title}</span>
                        </Link>

                        {/* Event metadata */}
                        <div className="grid grid-cols-[80px_1fr]">
                          <strong>Date</strong>
                          <p className="inline">{`${dateString}  ${startTimeString}-${endTimeString}`}</p>

                          <strong>Location</strong>
                          <p className="inline">{item.location}</p>

                          <strong>Speaker</strong>
                          <p className="inline">{item.speaker}</p>

                          <strong className="w-[80px]">Invited</strong>
                          <p className="inline">
                            {item.publicEvent ? "Public" : item.openTo.join(", ") + " only"}
                          </p>

                          {item.eventTags.length > 0 && <><strong className="pt-1">Topics</strong>
                            <div className="flex gap-2 pt-1">
                              {item.eventTags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                            </div>
                          </>}
                        </div>

                        {/*{item.summary && <p className="mt-2">{item.summary}</p>}*/}
                      </div>
                  );
                })
            )}

            {/* Pagination - uses router.push so back button returns to previous page */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationClientPrevious onClick={() => {
                    if (safePage > 1) {
                      const params = new URLSearchParams(searchParams.toString());
                      if (safePage - 1 === 1) params.delete("page");
                      else params.set("page", String(safePage - 1));
                      router.push(`/events?${params.toString()}`);
                    }
                  }}/>
                </PaginationItem>

                {Array.from({length: maxPage}, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationClientLink
                          onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            if (i + 1 === 1) params.delete("page");
                            else params.set("page", String(i + 1));
                            router.push(`/events?${params.toString()}`);
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
                      router.push(`/events?${params.toString()}`);
                    }
                  }}/>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
  );
}
