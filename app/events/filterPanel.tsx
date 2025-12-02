"use client"
import React from "react";
import {Button} from "@/components/ui/button";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {DatePicker1} from "@/components/ui/date-picker1";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {Checkbox} from "@/components/ui/checkbox";
import {
  OpenTo,
  TimePeriod
} from "@/app/events/interactiveEvents";
import {
  defaultEndDate,
  defaultOpenTo,
  defaultStartDate,
  defaultTimePeriod
} from "@/app/events/event_constants";
import {CheckedState} from "@radix-ui/react-checkbox";
import {usePathname, useRouter} from "next/navigation";

export type FilterPanelProps = {
  tagMap: Map<string, number>; // tagName -> tagId, ordered by tagName
}

/**
 * Client-side filter panel that manages draft filter state.
 * On APPLY, flushes state to URL which triggers server-side re-fetch.
 * @param tagMap - Map of tagName to tagId, ordered by tagName
 * @constructor
 */
export function FilterPanel({ tagMap }: FilterPanelProps) {
  // Draft state - managed entirely in FilterPanel
  const pathname = usePathname();
  const searchParams = new URLSearchParams();
  const { replace } = useRouter();
  const [selectedTimePeriod, setSelectedTimePeriod] = React.useState<TimePeriod>(searchParams.get("timePeriod") as TimePeriod ?? defaultTimePeriod);
  const [selectedOpenTo, setSelectedOpenTo] = React.useState<OpenTo>(defaultOpenTo);
  const [selectedTags, setSelectedTags] = React.useState<Set<number>>(new Set());
  const [customStartDate, setCustomStartDate] = React.useState<Date>(defaultStartDate);
  const [customEndDate, setCustomEndDate] = React.useState<Date>(defaultEndDate);


  const tagsArray = Array.from(tagMap.keys());

  /**
   * The Time Period radio group change handler
   * @param newValue
   */
  const handleTimePeriodChange = (newValue: TimePeriod) => {
    setSelectedTimePeriod(newValue);
  }

  /**
   * The Open To radio group change handler
   * @param newValue
   */
  const handleOpenToChange = (newValue: OpenTo) => {
    setSelectedOpenTo(newValue);
  }

  /**
   * Start datepicker change handler
   * @param date
   */
  const handleStartDateChange = (date: Date) => {
    // ensure start date is before end date
    date = date < customEndDate ? date : customEndDate;
    setCustomStartDate(date);
  }

  /**
   * End datepicker change handler
   * @param date
   */
  const handleEndDateChange = (date: Date) => {
    // ensure end date is after start date
    date = date > customStartDate ? date : customStartDate;
    setCustomEndDate(date);
  }

  /**
   * When APPLY FILTERS button clicked
   */
  const handleApplyFilters = () => {
    // TODO: Build URL search params and navigate
    const params = new URLSearchParams(searchParams);
    if (selectedTimePeriod === "custom"){
      params.set("from", customStartDate.toISOString())
      params.set("to", customEndDate.toISOString())
    } else {
      params.set('timePeriod', selectedTimePeriod);
    }
    params.set('openTo', selectedOpenTo)
    if (selectedTags.size > 0){
      params.set('tags', Array.from(selectedTags).join(","))
    } else {
      params.delete('tags')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  /**
   * Resets all filters to default state
   */
  const resetFilters = () => {
    setSelectedOpenTo(defaultOpenTo);
    setSelectedTimePeriod(defaultTimePeriod);
    setCustomStartDate(defaultStartDate);
    setCustomEndDate(defaultEndDate);
    setSelectedTags(new Set());
    // TODO: Navigate to clean URL
  }

  function handleOnChecked(tagId: number, checked: boolean) {
    const newSelectedTags = new Set(selectedTags);
    if (checked) {
      newSelectedTags.add(tagId);
    } else {
      newSelectedTags.delete(tagId);
    }
    setSelectedTags(newSelectedTags);
  }

  return <div
      className={"flex flex-col bg-secondary rounded-md  px-2 py-3 gap-2 text-secondary-foreground min-h-[600px] max-h-dvh overflow-y-auto sticky top-4"}>
    <h3 className={"text-xl text-center"}>Filter by</h3>
    <div className={"flex justify-between my-2"}>
      <Button size={"sm"} variant={"destructive"} onClick={resetFilters}>RESET</Button>
      <Button size={"sm"} onClick={handleApplyFilters}>APPLY FILTERS</Button>
    </div>
    <RadioGroup value={selectedTimePeriod} className={"mt-2"}
                onValueChange={handleTimePeriodChange}>
      <p className={"text-lg font-semibold px-2"}>Time period</p>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="upcoming" id="upcoming"/>
        <Label htmlFor="upcoming">Upcoming events</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="past" id="past"/>
        <Label htmlFor="past">Past events</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="all" id="all"/>
        <Label htmlFor="all">All events</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="custom" id="custom"/>
        <Label htmlFor="custom">Custom time period</Label>
      </div>
      {selectedTimePeriod === "custom" && <div className={"flex flex-col gap-4"}>
        <DatePicker1 labelText={"From"} date={customStartDate} onSelect={handleStartDateChange}/>
        <DatePicker1 labelText={"To"} date={customEndDate} onSelect={handleEndDateChange}/>
      </div>}
    </RadioGroup>
    {/* Allowed attendees (openTo) */}
    <Accordion type="single" collapsible defaultValue={"item-1"}>
      <AccordionItem value="item-1">
        <AccordionTrigger className={"[&>svg]:text-white mt-2 py-0 flex items-center "}><p
            className={"text-lg px-2"}>Allowed attendees</p></AccordionTrigger>
        <AccordionContent>
          <RadioGroup className={"mt-2"} value={selectedOpenTo}
                      onValueChange={handleOpenToChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Member" id="Member"/>
              <Label htmlFor="Member">Members</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Associate_Member" id="Associate_Member"/>
              <Label htmlFor="Associate_Member">Associate Members</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Student_Member" id="Student_Member"/>
              <Label htmlFor="Student_Member">Student Members</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public"/>
              <Label htmlFor="public">Public Event</Label>
            </div>
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    {/*  Topics */}
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className={"[&>svg]:text-white py-0 flex items-center "}><p
            className={"text-lg px-2"}>Topics</p></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 mt-2">
          {tagsArray.map((tagName) => {
            const tagId = tagMap.get(tagName)!;
            return (
              <div key={tagName} className="flex items-center gap-3">
                <Checkbox id={tagName}
                          value={tagName}
                          checked={selectedTags.has(tagId)}
                          onCheckedChange={(checked: CheckedState) => {
                            handleOnChecked(tagId, checked as boolean);
                          }}
                          />
                <Label htmlFor={tagName}>{tagName}</Label>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>;
}

