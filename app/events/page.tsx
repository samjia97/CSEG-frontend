import React from 'react'
import {EventFilterParams, getEvents} from "@/app/events/api/get-events";
import {InteractiveEvents} from "@/app/events/interactiveEvents";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";


export type EventPageSearchParams = {
  timePeriod?: string;
  from?: string;
  to?: string;
  openTo?: string;
  tags?: string;
  page?: string;
}

async function EventsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  console.log('params', searchParams);

  // Parse search params into typed object
  const parsedSearchParams: EventPageSearchParams = {
    timePeriod: typeof searchParams?.timePeriod === 'string' ? searchParams.timePeriod : undefined,
    from: typeof searchParams?.from === 'string' ? searchParams.from : undefined,
    to: typeof searchParams?.to === 'string' ? searchParams.to : undefined,
    openTo: typeof searchParams?.openTo === 'string' ? searchParams.openTo : undefined,
    tags: typeof searchParams?.tags === 'string' ? searchParams.tags : undefined,
    page: typeof searchParams?.page === 'string' ? searchParams.page : undefined,
    sort: typeof searchParams?.sort === 'string' ? searchParams.sort : undefined,
  };

  // Parse selected tags from URL
  const selectedTagsFromUrl = new Set<string>(
    parsedSearchParams?.tags
      ? parsedSearchParams.tags.split(',').map(tag => decodeURIComponent(tag.trim()))
      : []
  );

  // Parse sort option with validation
  const currentSort: SortOption = (parsedSearchParams.sort === "eventDate:desc" ||
    parsedSearchParams.sort === "eventDate:asc" ||
    parsedSearchParams.sort === "title:asc" ||
    parsedSearchParams.sort === "title:desc")
    ? parsedSearchParams.sort
    : "eventDate:desc";

// Build filters from search params
  const filters: EventFilterParams = {
    filters: {},
    pagination: {
      page: parsedSearchParams.page ? parseInt(parsedSearchParams.page, 10) : 1,
      pageSize: 25
    },
    sort: currentSort
  };

  // Default time period and openTo if not specified
  const timePeriod = parsedSearchParams?.timePeriod ?? "upcoming";
  const openTo = parsedSearchParams?.openTo ?? "Member";

  // Time period filter
  switch (timePeriod) {
    case "upcoming":
      filters.filters.eventDate = { $gte: new Date().toISOString() };
      break;
    case "past":
      filters.filters.eventDate = { $lte: new Date().toISOString() };
      break;
    case "custom":
      if (parsedSearchParams?.from && parsedSearchParams?.to) {
        filters.filters.eventDate = { $between: [parsedSearchParams.from, parsedSearchParams.to] };
      }
      break;
    case "all":
    default:
      // no date filter
      break;
  }

  // Open To filter
  if (openTo === "public") {
    filters.filters.publicEvent = { $eq: true };
  } else {
    filters.filters.open_to = {
      membershipName: { $in: [openTo.replace("_"," ")] }
    };
    filters.filters.publicEvent = { $eq: false };
  }

  // Tags filter using tag NAMES
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
        <Breadcrumb className={"bg-neutral-200 px-8 w-fit"}>
          <BreadcrumbList className={"text-lg"}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Events</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
            currentSort={currentSort}
          />
        </div>

      </main>
  )
}

export default EventsPage

