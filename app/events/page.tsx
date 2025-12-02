import React from 'react'
import {EventFilterParams, getEvents} from "@/app/events/api/get-events";
import {InteractiveEvents} from "@/app/events/interactiveEvents";
import {
  Breadcrumb,
  BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";


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

  // Build filters from search params
  const filters: EventFilterParams = {
    filters: {},
    pagination: {
      page: searchParams?.page ? parseInt(searchParams.page, 10) : 1,
      pageSize: 25
    },
    sort: "eventDate:desc"
  };

  // Time period filter
  if (searchParams) {
    switch (searchParams.timePeriod) {
      case "upcoming":
        filters.filters.eventDate = { $gte: new Date().toISOString() };
        break;
      case "past":
        filters.filters.eventDate = { $lte: new Date().toISOString() };
        break;
      case "custom":
        if (searchParams.from && searchParams.to) {
          filters.filters.eventDate = { $between: [searchParams.from, searchParams.to] };
        }
        break;
      case "all":
      default:
        // no date filter
        break;
    }

    // Open To filter
    if (searchParams.openTo) {
      if (searchParams.openTo === "public") {
        filters.filters.publicEvent = { $eq: true };
      } else {
        filters.filters.open_to = {
          membershipName: { $in: [searchParams.openTo] }
        };
        filters.filters.publicEvent = { $eq: false };
      }
    }

    // Tags filter (tag IDs as comma-separated string)
    if (searchParams.tags) {
      const tagIds = searchParams.tags
        .split(',')
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));

      if (tagIds.length > 0) {
        // Each tag becomes a separate condition in $and array
        filters.filters.$and = tagIds.map(tagId => ({
          event_tags: {
            id: {
              $eq: tagId  // Use $eq for exact match, not $in
            }
          }
        }));
      }
    }
  }

  // Fetch events with filters
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
          <InteractiveEvents events={events} filters={filters} />
        </div>

      </main>
  )
}

export default EventsPage

