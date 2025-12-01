"use client"
import {EventCardData, EventFilterParams, getEvents} from "@/app/events/api/get-events";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {formatDate} from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import {Badge} from "@/components/ui/badge";


type InteractiveEventsProps = {
  allEvents: EventCardData[];
}

enum TimePeriod {
  UPCOMING,
  PAST,
  ALL
}

enum SortByOptions {
  NEWEST_TO_OLDEST = "newest to oldest",
  OLDEST_TO_NEWEST = "oldest to newest",
  TITLE_AZ = "title A to Z",
  TITLE_ZA = "title Z to A"
}

const NoEventsPage = () => {
  return (
      <div
          className={"min-w-full px-20 py-4 h-[200px] bg-accent/50 rounded-md"}>
        <h3 className={"text-center"}>No events with search terms and filter</h3>
        <h4>Please try:</h4>
        <ol className={"list-decimal pl-5 space-y-1 ml-4"}>
          <li>Checking the spelling of your search term or using a broader term</li>
          <li>Removing some filters</li>
        </ol>
      </div>
  )
}

export type FilterPanelProps = {
  filters: EventFilterParams
  setFilters: React.Dispatch<EventFilterParams>
}

function FilterPanel() {
  return <div
      className={"flex flex-col bg-secondary rounded-md  px-2 py-3 text-secondary-foreground min-h-[600px] h-full"}>
    <h3 className={"text-xl "}>Filter by</h3>
    <h4 className={"text-lg "}>Time period</h4>
    <hr/>
    <RadioGroup defaultValue="UPCOMING" className={"mt-2"}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="UPCOMING" id="UPCOMING"/>
        <Label htmlFor="UPCOMING">Upcoming events</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="PAST" id="PAST"/>
        <Label htmlFor="PAST">Past events</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="ALL" id="ALL"/>
        <Label htmlFor="ALL">All events</Label>
      </div>
    </RadioGroup>

  </div>;
}

/**
 * A client component for filtering and ordering events
 * @constructor
 */
export function InteractiveEvents() {
  // const filterEvents = await getEvents();
  const [filters, setFilters] = useState<EventFilterParams>({
    filters: {
      eventDate: {
        // $gte: new Date().toISOString()
      }
    }
  });
  const [events, setEvents] = useState<EventCardData[]>([]);
  useEffect(() => {
    getEvents(filters).then(r => setEvents(r))
  }, [filters]);
// const [filterEvents, setFilteredEvents] = useState(allEvents.filter(value => value.eventEndDateTime >= new Date()));
  // const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.NEWEST_TO_OLDEST);
  // const handleTimePeriodChange = (newValue: string) => {
  //   let newEvents = allEvents;
  //   if (newValue === 'UPCOMING') {
  //     newEvents = allEvents.filter(value => value.eventEndDateTime >= new Date());
  //   } else if (newValue === "PAST") {
  //     newEvents = allEvents.filter(value => value.eventEndDateTime < new Date());
  //   }
  //   setFilteredEvents(newEvents);
  // }
  /**
   * Sorts events based on selected sortBy option
   */
  // const sortEvents = (newSortBy: SortByOptions) => {
  //   const sortedEvents = [...filterEvents];
  //   switch (newSortBy) {
  //     case SortByOptions.NEWEST_TO_OLDEST:
  //       sortedEvents.sort((a, b) => a.eventStartDateTime.getTime() - b.eventStartDateTime.getTime());
  //       break;
  //     case SortByOptions.OLDEST_TO_NEWEST:
  //       sortedEvents.sort((a, b) => b.eventStartDateTime.getTime() - a.eventStartDateTime.getTime());
  //       break;
  //     case SortByOptions.TITLE_AZ:
  //       sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
  //       break;
  //     case SortByOptions.TITLE_ZA:
  //       sortedEvents.sort((a, b) => b.title.localeCompare(a.title));
  //       break;
  //   }
  //   setSortBy(newSortBy);
  //   setFilteredEvents(sortedEvents);
  // }

  return (
      <div className={"flex flex-col gap-2 items-start mt-2 max-w-7xl w-full"}>
        <div className={"flex self-end gap-2 items-center"}><p>Sort by</p>
          {/*<DropdownMenu>*/}
          {/*  <DropdownMenuTrigger asChild><Button variant="outline"*/}
          {/*                                       className={"flex px-2 w-[200px] items-center justify-start gap-1"}>*/}
          {/*    <ChevronRight className="h-4 w-4"/>{sortBy}*/}
          {/*  </Button></DropdownMenuTrigger>*/}
          {/*  <DropdownMenuContent className={"w-[200px]"}>*/}
          {/*    /!* Display unselected sortBy options. Note Object.values works on any object *!/*/}
          {/*    {Object.values(SortByOptions).map((sortByOption) => (sortByOption !== sortBy &&*/}
          {/*        <DropdownMenuItem key={sortByOption}*/}
          {/*                          onClick={() => sortEvents(sortByOption)}>{sortByOption}</DropdownMenuItem>))}*/}
          {/*  </DropdownMenuContent>*/}
          {/*</DropdownMenu>*/}
        </div>
        <div className={"grid grid-cols-[200px_1fr] w-full gap-4"}>
          <FilterPanel/>
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
          </div>
        </div>
      </div>);
}