import {EventCardData, StrapiMeta} from "@/app/events/api/get-events";
import React from "react";
import Link from "next/link";
import {formatDate} from "@/lib/formatters";
import {Badge} from "@/components/ui/badge";
import {NoEventsPage} from "@/app/events/noEventsPage";
import {FilterPanel} from "@/app/events/filterPanel";
import {
  Pagination,
  PaginationContent,
  PaginationItem, PaginationLink, PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {SortBy, SortOption} from "@/app/events/sortBy";

export type TimePeriod = 'upcoming' | 'past' | 'all' | 'custom';
export type OpenTo = 'public' | 'Member' | 'Associate_Member' | 'Student_Member';

/**
 * Extracts unique tag names from events and returns them as a Set
 */
const extractTags = (eventItems: EventCardData[]): Set<string> => {
  const eventTags: Set<string> = new Set();
  for (const eventItem of eventItems) {
    for (const tag of eventItem.eventTags) {
      eventTags.add(tag);
    }
  }
  return eventTags;
}

type InteractiveEventsProps = {
  events: EventCardData[];
  selectedTagsFromUrl: Set<string>;
  currentURLParams: {
    [key: string]: string | string[] | undefined;
  } | undefined
  meta: StrapiMeta;
  currentSort: SortOption;
}

/**
 * A server component for displaying filtered events
 * @param events - The filtered events from the server
 * @param selectedTagsFromUrl - Tag names selected from URL params
 * @param currentURLParams - Current URL search parameters
 * @param meta - Strapi pagination metadata
 * @param currentSort - Current sort option from URL
 * @constructor
 */
export function InteractiveEvents({ events, selectedTagsFromUrl, currentURLParams, meta, currentSort }: InteractiveEventsProps) {
  // Merge selected tags with tags from filtered results
  const resultTags = extractTags(events);
  const combinedTags = new Set([...selectedTagsFromUrl, ...resultTags]);
  const previousURLParams = new URLSearchParams(currentURLParams as Record<string, string>);
  const nextURLParams = new URLSearchParams(currentURLParams as Record<string, string>);

  const currentPage = parseInt(previousURLParams.get('page') || '1', 10);
  const previousPage = Math.max(currentPage - 1, 1);
  previousURLParams.set('page', String(previousPage));
  const prevLink = `/events?${previousURLParams.toString()}`;

  const nextPage = currentPage + 1;
  nextURLParams.set('page', String(nextPage));
  const nextLink = `/events?${nextURLParams.toString()}`;

  // Pagination links with numbers
  const numberLinks = [];
  for (let i = 0; i < meta.pagination.pageCount; i++) {
    const pageNum = i + 1;
    const pageURLParams = new URLSearchParams(currentURLParams as Record<string, string>);
    pageURLParams.set('page', String(pageNum));
    const pageLink = `/events?${pageURLParams.toString()}`;
    numberLinks.push(
        <PaginationItem key={pageNum}>
          <PaginationLink href={pageLink} isActive={pageNum === currentPage}>
            {pageNum}
          </PaginationLink>
        </PaginationItem>
    );
  }

  // Sort alphabetically
  const sortedTagArray = Array.from(combinedTags).sort((a, b) => a.localeCompare(b));

  return (
      <div className={"flex flex-col gap-2 items-start mt-2 max-w-7xl w-full"}>
        <SortBy currentSort={currentSort} />
        <div className={"grid grid-cols-[240px_1fr] w-full gap-4"}>
          <FilterPanel
              availableTags={sortedTagArray}
              selectedTagsFromUrl={selectedTagsFromUrl}
          />
          <div className={"flex flex-col  gap-4 w-full "}>
            {events.length === 0 && <NoEventsPage/>}

            {events.map((item) => {
                  const dateString = formatDate(item.eventStartDateTime);
                  const startTimeString = item.eventStartString
                  const endTimeString = item.eventEndString
                  return (
                      <div key={item.id} className={"drop-shadow-md shadow bg-neutral-100 px-4 pb-4"}>
                        {/*Event title*/}
                        <Link href={`/events/${item.slug}`} className={"text-xl"}>
                          <span className={"text-accent no-underline"}>[{item.eventType}]</span> <span
                            className={"text-primary underline"}>{item.title}</span>
                        </Link>
                        {/*Event metadata*/}
                        <div className={"grid grid-cols-[80px_1fr]"}>
                          <strong>Date</strong><p
                            className={"inline"}>{`${dateString}  ${startTimeString}-${endTimeString}`}</p>
                          <strong>Location</strong><p className={"inline"}>{item.location}</p>
                          <strong>Speaker</strong><p className={"inline"}>{item.speaker}</p>
                          {/*Open to*/}
                          <strong className={"w-[80px]"}>Open to </strong>
                          {item.publicEvent ? "Public" : item.openTo.join(", ") + " only"}
                          {/*Topics */}
                          <strong className={"pt-1"}>Topics </strong>
                          <div className={"flex gap-2 pt-1"}>
                            {item.eventTags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                          </div>
                        </div>
                        <div className={"grid grid-cols-[80px_1fr] mt-2"}>
                        </div>
                        <p>{item.summary}</p>
                      </div>)
                }
            )}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href={prevLink} />
              </PaginationItem>
              {numberLinks}
              <PaginationItem>
                <PaginationNext href={nextLink} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          </div>

        </div>
      </div>);
}

