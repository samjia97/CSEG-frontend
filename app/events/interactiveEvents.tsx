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
import {SortBy, SortOption} from "@/app/events/sortBy";
import {Button} from "@/components/ui/button";
import SearchBar from "@/app/events/searchBar";
import {
  defaultEndDate,
  defaultOpenTo,
  defaultStartDate,
  defaultTimePeriod
} from "@/app/events/event_constants";

export const OPEN_TO_OPTIONS = ['Public', 'Member', 'Associate Member', 'Student Member'] as const;


export type TimePeriod = 'upcoming' | 'past' | 'all' | 'custom';
export type OpenTo = typeof OPEN_TO_OPTIONS[number];
export type OpenToSelection = Set<OpenTo>;

const PAGE_SIZE = 10;

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
  // If no selections, show nothing (or optionally show all)
  if (openTo.size === 0) return true; // or return false to hide all

  // Check if event matches any selected option
  for (const selection of openTo) {
    if (selection === 'Public' && event.publicEvent) {
      return true;
    }
    if (event.openTo.includes(selection)) {
      return true;
    }
  }
  return false;
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

/**
 * Client-side interactive events with filtering, search, and pagination
 * Matches publications pattern exactly
 */
export function InteractiveEvents({initialEvents, topics}: InteractiveEventsProps) {
  // Filter state
  const [timePeriod, setTimePeriodState] = useState<TimePeriod>(defaultTimePeriod);
  const [openTo, setOpenToState] = useState<OpenToSelection>(defaultOpenTo);
  const [selectedTopics, setSelectedTopicsState] = useState<Set<string>>(new Set());
  const [customStartDate, setCustomStartDate] = useState<Date>(defaultStartDate);
  const [customEndDate, setCustomEndDate] = useState<Date>(defaultEndDate);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>('eventDate:desc');
  const [page, setPage] = useState<number>(1);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // Wrapper setters that reset page to 1 (avoids useEffect cascading renders)
  const setTimePeriod: typeof setTimePeriodState = (value) => {
    setTimePeriodState(value);
    setPage(1);
  };
  const setOpenTo: typeof setOpenToState = (value) => {
    setOpenToState(value);
    setPage(1);
  };
  const setSelectedTopics: typeof setSelectedTopicsState = (value) => {
    setSelectedTopicsState(value);
    setPage(1);
  };

  // Client-side filtering with useMemo for performance
  const filteredAndSortedEvents = useMemo(() => {
    // Create 'now' once outside the filter loop for performance
    const now = new Date();

    const filtered = initialEvents.filter(event =>
        matchesSearch(event, searchQuery) &&
        matchesTimePeriod(event, timePeriod, customStartDate, customEndDate, now) &&
        matchesOpenTo(event, openTo) &&
        matchesTopics(event, selectedTopics)
    );
    return sortEvents(filtered, sortOption);
  }, [initialEvents, searchQuery, timePeriod, customStartDate, customEndDate, openTo, selectedTopics, sortOption]);

  // Pagination
  const maxPage = Math.max(1, Math.ceil(filteredAndSortedEvents.length / PAGE_SIZE));
  const paginatedEvents = filteredAndSortedEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  // Handle clear all (resets everything)
  const handleClearAll = () => {
    setSearchQuery("");
    setTimePeriodState(defaultTimePeriod);
    setOpenToState(defaultOpenTo);
    setSelectedTopicsState(new Set());
    setCustomStartDate(defaultStartDate);
    setCustomEndDate(defaultEndDate);
    setSortOption('eventDate:desc');
    setPage(1);
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
                  setTimePeriod={setTimePeriod}
                  openTo={openTo}
                  setOpenTo={setOpenTo}
                  selectedTopics={selectedTopics}
                  setSelectedTopics={setSelectedTopics}
                  customStartDate={customStartDate}
                  setCustomStartDate={setCustomStartDate}
                  customEndDate={customEndDate}
                  setCustomEndDate={setCustomEndDate}
              />
          )}

          {/* Main Content */}
          <div className="flex flex-col gap-4 w-full">
            {/* Search and Controls */}
            <div className={"flex flex-col gap-4"}>
              <SortBy currentSort={sortOption} onSortChange={setSortOption}/>
              <div className="flex gap-2">
                {/*<Button*/}
                {/*    type="button"*/}
                {/*    variant="outline"*/}
                {/*    onClick={() => setIsFilterOpen(!isFilterOpen)}*/}
                {/*    aria-label={isFilterOpen ? "Hide filters" : "Show filters"}*/}
                {/*>*/}
                {/*  <Settings2/>*/}
                {/*  Filters*/}
                {/*</Button>*/}
                <SearchBar onSearch={handleSearch}/>
                  <Button
                      type="button"
                      variant="destructive"
                      onClick={handleClearAll}
                  >
                    CLEAR
                  </Button>

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

                          <strong className="w-[80px]">Open to</strong>
                          <p className="inline">
                            {item.publicEvent ? "Public" : item.openTo.join(", ") + " only"}
                          </p>

                          {item.eventTags.length > 0 && <><strong className="pt-1">Topics</strong>
                            <div className="flex gap-2 pt-1">
                              {item.eventTags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                            </div>
                          </> }
                        </div>

                        {/*{item.summary && <p className="mt-2">{item.summary}</p>}*/}
                      </div>
                  );
                })
            )}

            {/* Pagination */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationClientPrevious onClick={() => setPage(Math.max(1, page - 1))}/>
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
                  <PaginationClientNext onClick={() => setPage(Math.min(maxPage, page + 1))}/>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
  );
}

