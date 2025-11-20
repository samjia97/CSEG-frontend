"use client"
import {EventCardData} from "@/app/events/api/get-events";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import React, {useState} from "react";
import Link from "next/link";
import {formatDate} from "@/lib/formatters";

type InteractiveEventsProps = {
  allEvents: EventCardData[];
}

enum TimePeriod {
  UPCOMING,
  PAST,
  ALL
}



export function InteractiveEvents({allEvents}: InteractiveEventsProps) {
  const [filterEvents, setFilteredEvents] = useState(allEvents.filter(value => value.eventEndDateTime >= new Date()));
  const handleTimePeriodChange = (newValue: string) =>{
    let newEvents = allEvents;
    if (newValue === 'UPCOMING'){
      newEvents = allEvents.filter(value => value.eventEndDateTime >= new Date());
    } else if (newValue === "PAST") {
      newEvents = allEvents.filter(value => value.eventEndDateTime < new Date());
    }
    setFilteredEvents(newEvents);
  }
  return <div className={"grid grid-cols-[200px_1fr] gap-4 mt-8 max-w-7xl w-full"}>
    <div className={"flex flex-col bg-secondary  px-2 py-3 text-secondary-foreground min-h-[600px] h-full"}>
      <h3 className={"text-xl "}>Filter by</h3>
      <h4 className={"text-lg "}>Time period</h4>
      <hr/>
      <RadioGroup defaultValue="UPCOMING" className={"mt-2"} onValueChange={handleTimePeriodChange}>
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

    </div>
    <div className={"flex flex-col  gap-4 w-full "}>
      {filterEvents.length === 0 && <div
          className={"w-full h-[200px] bg-accent/50 flex justify-center items-center text-2xl rounded-md"}>No
        events to show
      </div>}

      {filterEvents.map((item) => {
        const dateString = formatDate(item.eventStartDateTime);
        const startTimeString = item.eventStartString
        const endTimeString = item.eventEndString
        return (
              <div key={item.id} className={"drop-shadow-md shadow bg-neutral-100 px-4"}>
                <Link href={`/events/${item.slug}`} className={"text-xl"}>
                  <span className={"text-accent no-underline"}>[{item.eventType}]</span> <span className={"text-primary underline"}>{item.title}</span>
                </Link>
                <div className={"grid grid-cols-[80px_1fr] text-lg"}>
                  <strong>Date</strong><p className={"inline"}>{`${dateString}  ${startTimeString}-${endTimeString}`}</p>
                  <strong>Location</strong><p className={"inline"}>{item.location}</p>
                  <strong>Speaker</strong><p className={"inline"}>{item.speaker}</p>
                </div>
                  <p >{item.summary}</p>
              </div>)}
      )}
    </div>
  </div>;
}