import {EventCardData, EventFilterParams} from "@/app/events/api/get-events";
import React from "react";
import Link from "next/link";
import {formatDate} from "@/lib/formatters";
import {Badge} from "@/components/ui/badge";
import {NoEventsPage} from "@/app/events/noEventsPage";
import {FilterPanel} from "@/app/events/filterPanel";

export type TimePeriod = 'upcoming' | 'past' | 'all' | 'custom';
export type OpenTo = 'public' | 'Member' | 'Associate_Member' | 'Student_Member';

const extractTags = (eventItems: EventCardData[]) => {
  const eventTags: Map<string, number> = new Map();
  for (const eventItem of eventItems) {
    for (const tag of eventItem.eventTags) {
      if (!eventTags.has(tag.tagName)) {
        eventTags.set(tag.tagName, tag.tagId);
      }
    }
  }
  // Sort by tagName alphabetically
  return new Map([...eventTags].sort((a, b) => a[0].localeCompare(b[0])));
}

type InteractiveEventsProps = {
  events: EventCardData[];
  filters: EventFilterParams;
}

/**
 * A server component for displaying filtered events
 * @param events - The filtered events from the server
 * @param filters - The current filter state
 * @constructor
 */
export function InteractiveEvents({ events, filters }: InteractiveEventsProps) {
  const tagMap = extractTags(events);

  return (
      <div className={"flex flex-col gap-2 items-start mt-2 max-w-7xl w-full"}>
        <div className={"flex self-end gap-2 items-center"}><p>Sort by</p>
          {/*<Select onValueChange={sortEvents} defaultValue={"eventDate:desc"}>*/}
          {/*  <SelectTrigger*/}
          {/*      className="w-[150px] rounded-none border-black drop-shadow-none transition-none focus-visible:ring-0 focus-visible:border-black">*/}
          {/*    <SelectValue placeholder={"eventDate:desc"}/>*/}
          {/*  </SelectTrigger>*/}
          {/*  <SelectContent>*/}
          {/*    <SelectItem value={"eventDate:desc"}>New to Old </SelectItem>*/}
          {/*    <SelectItem value={"eventDate:asc"}>Old to New</SelectItem>*/}
          {/*    <SelectItem value={"title:asc"}>Title A to Z</SelectItem>*/}
          {/*    <SelectItem value={"title:desc"}>Title Z to A</SelectItem>*/}
          {/*  </SelectContent>*/}
          {/*</Select>*/}
        </div>
        <div className={"grid grid-cols-[240px_1fr] w-full gap-4"}>
          <FilterPanel
              tagMap={tagMap}
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
                            {item.eventTags.map((tag) => <Badge key={tag.tagName}>{tag.tagName}</Badge>)}
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

