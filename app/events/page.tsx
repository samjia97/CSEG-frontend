import React from 'react'
import {EventFilterParams, getEvents} from "@/app/events/api/get-events";
import {InteractiveEvents} from "@/app/events/interactiveEvents";
import {defaultOpenTo, defaultSort, defaultTimePeriod} from "@/app/events/event_constants";
import {SortOption} from "@/app/events/sortBy";


export type EventPageSearchParams = {
  timePeriod: string;
  from?: string;
  to?: string;
  openTo: string;
  tags?: string;
  page: string;
  sort: SortOption;
  query?: string;
}

/**
 * Parses sort from URL parameter, defaults if invalid
 * @param sortParam
 */
const parseSort = (sortParam: string | undefined | string[]): SortOption => {
  if (typeof sortParam !== 'string') {
    return defaultSort;
  } else if (["eventDate:desc", "eventDate:asc", "title:asc", "title:desc"].includes(sortParam)) {
    return sortParam as SortOption;
  } else {
    return defaultSort;
  }
}


function buildFilters(parsedSearchParams: EventPageSearchParams): EventFilterParams {
  // Build filters from search params
  const filters: EventFilterParams = {
    filters: {},
    pagination: {
      page: parsedSearchParams.page ? parseInt(parsedSearchParams.page, 10) : 1,
      pageSize: 25
    },
    sort: parsedSearchParams.sort
  };
  // Time period filter
  switch (parsedSearchParams.timePeriod) {
    case "upcoming":
      filters.filters.eventDate = {$gte: new Date().toISOString()};
      break;
    case "past":
      filters.filters.eventDate = {$lte: new Date().toISOString()};
      break;
    case "custom":
      if (parsedSearchParams?.from && parsedSearchParams?.to) {
        filters.filters.eventDate = {$between: [parsedSearchParams.from, parsedSearchParams.to]};
      }
      break;
    case "all":
    default:
      // no date filter
      break;
  }

  // Open To filter
  if (parsedSearchParams.openTo === "public") {
    filters.filters.publicEvent = {$eq: true};
  } else {
    filters.filters.open_to = {
      membershipName: {$in: [parsedSearchParams.openTo.replace("_", " ")]}
    };
    filters.filters.publicEvent = {$eq: false};
  }

  // Search query over title, summary, speaker
  if (parsedSearchParams.query){
    filters.filters.$or = [
      {
        title: {
          $containsi: parsedSearchParams.query
        }
      },
      {
        speaker: {
          $containsi: parsedSearchParams.query
        }
      },
      {
        summary: {
          $containsi: parsedSearchParams.query
        }
      }
    ]
  }
  return filters;
}

async function EventsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;


  // Parse search params into typed object with default values if not a string.
  const parsedSearchParams: EventPageSearchParams = {
    timePeriod: typeof searchParams?.timePeriod === 'string' ? searchParams.timePeriod : defaultTimePeriod,
    from: typeof searchParams?.from === 'string' ? searchParams.from : undefined,
    to: typeof searchParams?.to === 'string' ? searchParams.to : undefined,
    openTo: typeof searchParams?.openTo === 'string' ? searchParams.openTo : defaultOpenTo,
    tags: typeof searchParams?.tags === 'string' ? searchParams.tags : undefined,
    page: typeof searchParams?.page === 'string' ? searchParams.page : '1',
    sort: parseSort(searchParams?.sort),
    query: typeof searchParams?.query === 'string' ? searchParams.query : undefined,
  };
  // Generate filters object for qs
  const filters = buildFilters(parsedSearchParams);

  // Parse selected tags from URL. Tags may be undefined.
  const selectedTagsFromUrl = new Set<string>(
      parsedSearchParams?.tags
          ? parsedSearchParams.tags.split(',').map(tag => decodeURIComponent(tag.trim()))
          : []
  );

  if (selectedTagsFromUrl.size > 0) {
    // Build $and filter for each tag name
    filters.filters.$and = Array.from(selectedTagsFromUrl).map(tagName => ({
      event_tags: {
        tagName: {
          $eq: tagName
        }
      }
    }));
  }

  // Fetch filtered events
  const {events, meta} = await getEvents(filters);
  console.log(meta)

  return (
      <main className={"min-h-screen pt-2 bg-neutral-50 px-4"}>
        <div className={"flex flex-col text-center"}>
          <h1 className={"text-5xl mb-4"}>Events</h1>
          <p>Our events where we learn more about Computer Science Education together.</p>
        </div>
        <div className={"flex justify-center"}>
          <InteractiveEvents
              events={events}
              selectedTagsFromUrl={selectedTagsFromUrl}
              currentURLParams={searchParams}
              meta={meta}
              currentSort={parsedSearchParams.sort}
          />
        </div>

      </main>
  )
}

export default EventsPage

