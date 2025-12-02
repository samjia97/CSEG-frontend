import React from 'react'
import {EventCardData, EventFilterParams, getEvents} from "@/app/events/api/get-events";
import {InteractiveEvents} from "@/app/events/interactiveEvents";
import {
  Breadcrumb,
  BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

/**
 * Extracts unique tag names from events
 */
const extractAllTags = (eventItems: EventCardData[]): Set<string> => {
  const eventTags: Set<string> = new Set();
  for (const eventItem of eventItems) {
    for (const tag of eventItem.eventTags) {
      eventTags.add(tag);
    }
  }
  return eventTags;
}

async function EventsPage(props: {
  searchParams?: Promise<{
    timePeriod?: string;
    from?: string;
    to?: string;
    openTo?: string;
    tags?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  console.log('params', searchParams);

  // Parse selected tags from URL
  const selectedTagsFromUrl = new Set<string>(
    searchParams?.tags
      ? searchParams.tags.split(',').map(tag => decodeURIComponent(tag.trim()))
      : []
  );

  // Fetch ALL events to get complete tag list
  const allEvents = await getEvents({
    filters: {},
    sort: "eventDate:desc",
    pagination: { pageSize: 1000 }
  });
  const allEventTags = extractAllTags(allEvents);

  // Build filters from search params
  const filters: EventFilterParams = {
    filters: {},
    pagination: {
      page: searchParams?.page ? parseInt(searchParams.page, 10) : 1,
      pageSize: 25
    },
    sort: "eventDate:desc"
  };

  // Default time period and openTo if not specified
  const timePeriod = searchParams?.timePeriod ?? "upcoming";
  const openTo = searchParams?.openTo ?? "Member";

  // Time period filter
  switch (timePeriod) {
    case "upcoming":
      filters.filters.eventDate = { $gte: new Date().toISOString() };
      break;
    case "past":
      filters.filters.eventDate = { $lte: new Date().toISOString() };
      break;
    case "custom":
      if (searchParams?.from && searchParams?.to) {
        filters.filters.eventDate = { $between: [searchParams.from, searchParams.to] };
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
  const events = await getEvents(filters);

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
            allEventTags={allEventTags}
            selectedTagsFromUrl={selectedTagsFromUrl}
            filters={filters}
          />
        </div>

      </main>
  )
}

export default EventsPage

