"use client"
import {EventCardData, EventFilterParams, getEvents} from "@/app/events/api/get-events";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {formatDate} from "@/lib/formatters";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {deepEqual} from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {Checkbox} from "@/components/ui/checkbox";
import {DatePicker1} from "@/components/ui/date-picker1";

type TimePeriod = 'upcoming' | 'past' | 'all' | 'custom';
type OpenTo = 'public' | 'Member' | 'Associate Member' | 'Student Member';

type InteractiveEventsProps = {
  allEvents: EventCardData[];
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
  filters: EventFilterParams,
  setFilters: React.Dispatch<EventFilterParams>,
  tags: Set<string>,
  newFilterState: EventFilterParams,
  setNewFilterState: React.Dispatch<React.SetStateAction<EventFilterParams>>,
  selectedOpenTo: OpenTo,
  setSelectedOpenTo: React.Dispatch<React.SetStateAction<OpenTo>>,
  selectedTimePeriod: TimePeriod,
  setSelectedTimePeriod: React.Dispatch<React.SetStateAction<TimePeriod>>,
  selectedTags: Set<string>,
  setSelectedTags: React.Dispatch<React.SetStateAction<Set<string>>>,
  customStartDate: Date,
  setCustomStartDate: React.Dispatch<React.SetStateAction<Date>>,
  customEndDate: Date,
  setCustomEndDate: React.Dispatch<React.SetStateAction<Date>>
}
/**
 * Returns default selection of who can attend an event passed form parent component
 * @param filters
 */
const getDefaultOpenTo = (filters: EventFilterParams): OpenTo => {
  if (filters.filters?.publicEvent) {
    return "public"
  }
  const membershipNameArray = filters.filters?.open_to?.membershipName?.$in ?? [];
  if (membershipNameArray.length > 0) {
    return membershipNameArray[0] as OpenTo;
  }
  return "Member";
}

/**
 * Updates applied filter state when APPLY clicked.
 * @param filters
 * @param setFilters
 * @param tags
 * @param newFilterState
 * @param setNewFilterState
 * @param selectedOpenTo
 * @param setSelectedOpenTo
 * @param selectedTimePeriod
 * @param setSelectedTimePeriod
 * @param selectedTags
 * @param setSelectedTags
 * @param customStartDate
 * @param setCustomStartDate
 * @param customEndDate
 * @param setCustomEndDate
 * @constructor
 */
function FilterPanel({
                       filters,
                       setFilters,
                       tags,
                       newFilterState,
                       setNewFilterState,
                       selectedOpenTo,
                       setSelectedOpenTo,
                       selectedTimePeriod,
                       setSelectedTimePeriod,
                       selectedTags,
                       setSelectedTags,
                       customStartDate,
                       setCustomStartDate,
                       customEndDate,
                       setCustomEndDate
                     }: FilterPanelProps) {
  // Temporary state of filters applied to actual filter state when APPLY clicked
  const sortedTags = Array.from(tags).sort();
  const handleTimePeriodChange = (newValue: TimePeriod) => {
    setSelectedTimePeriod(newValue);
    switch (newValue) {
      case 'upcoming':
        setNewFilterState({
          ...newFilterState,
          filters: {
            ...newFilterState.filters,
            eventDate: {
              $gte: new Date().toISOString()
            }
          }
        });
        break;

      case 'past':
        setNewFilterState({
          ...newFilterState,
          filters: {
            ...newFilterState.filters,
            eventDate: {
              $lte: new Date().toISOString()
            }
          }
        });
        break;

      case 'all':
        setNewFilterState({
          ...newFilterState,
          filters: {
            ...newFilterState.filters,
            eventDate: {}
          }
        });
        break;

      case 'custom':
        setNewFilterState({
          ...newFilterState,
          filters:{
            ...newFilterState.filters,
            eventDate: {
              $between: [customStartDate.toISOString(), customEndDate.toISOString()]
            }
          }
        });
        break;
    }
  }

  const handleOpenToChange = (newValue: OpenTo) => {
    setSelectedOpenTo(newValue);
    switch (newValue) {
      case 'public':
        // For public events, we need to check the actual publicEvent field
        // Remove the open_to filter to show public events
        setNewFilterState({
          ...newFilterState,
          filters: {
            publicEvent: {
              $eq: true
            }
          }
        });
        break;
      case 'Member':
        setNewFilterState({
          ...newFilterState,
          filters: {
            ...newFilterState.filters,
            open_to: {
              membershipName: {
                $in: ['Member']
              }
            },
            publicEvent: {
              $eq: false
            }
          }
        });
        break;
      case 'Associate Member':
        setNewFilterState({
          ...newFilterState,
          filters: {
            ...newFilterState.filters,
            open_to: {
              membershipName: {
                $in: ['Associate Member']
              }
            },
            publicEvent: {
              $eq: false
            }
          }
        });
        break;
      case 'Student Member':
        setNewFilterState({
          ...newFilterState,
          filters: {
            ...newFilterState.filters,
            open_to: {
              membershipName: {
                $in: ['Student Member']
              }
            },
            publicEvent: {
              $eq: false
            }
          }
        });
        break;
    }
  }
  /**
   * Start datepicker change handler
   * @param date
   */
  const handleStartDateChange = (date: Date) => {
    // ensure start date is before end date
    date = date < customEndDate ? date : customEndDate;
    setCustomStartDate(date);
    setNewFilterState({
      ...newFilterState,
      filters:{
        ...newFilterState.filters,
        eventDate: {
          $between: [date.toISOString(), customEndDate.toISOString()]
        }
      }
    });
  }
  /**
   * End datepicker change handler
   * @param date
   */
  const handleEndDateChange = (date: Date) => {
    // ensure end date is after start date
    date = date > customStartDate ? date : customStartDate;
    setCustomEndDate(date);
    setNewFilterState({
      ...newFilterState,
      filters:{
        ...newFilterState.filters,
        eventDate: {
          $between: [customStartDate.toISOString(), date.toISOString()]
        }
      }
    });
  }

  /**
   * When APPLY FILTERS button clicked
   */
  const handleApplyFilters = () => {
    setFilters(newFilterState);
  }
  /**
   * Resets all filters to default state
   */
  const resetFilters = () => {
    setNewFilterState(defaultFilters);
    setSelectedOpenTo(defaultOpenTo);
    setSelectedTimePeriod(defaultTimePeriod);
    setCustomStartDate(defaultStartDate);
    setCustomEndDate(defaultEndDate);
    setSelectedTags(new Set());
    setFilters(defaultFilters);
  }


  return <div
      className={"flex flex-col bg-secondary rounded-md  px-2 py-3 gap-2 text-secondary-foreground min-h-[600px] h-full"}>
    <h3 className={"text-xl text-center"}>Filter by</h3>
    <div className={"flex justify-between my-2"}>
      <Button size={"sm"} variant={"destructive"} onClick={resetFilters}>RESET</Button>
      <Button size={"sm"} onClick={handleApplyFilters}
              disabled={deepEqual(filters, newFilterState)}

      >APPLY FILTERS</Button>
    </div>
    <RadioGroup value={selectedTimePeriod} className={"mt-2"} onValueChange={handleTimePeriodChange}>
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
        <DatePicker1 labelText={"From"} date={customStartDate} onSelect={handleStartDateChange} />
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
              <RadioGroupItem value="Associate Member" id="Associate Member"/>
              <Label htmlFor="Associate Member">Associate Members</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Student Member" id="Student Member"/>
              <Label htmlFor="Student Member">Student Members</Label>
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
          {sortedTags.map((tag) =>
              <div key={tag} className="flex items-center gap-3">
                <Checkbox id={tag}
                          checked={selectedTags.has(tag)}
                          onCheckedChange={(checked) => {
                            const newSelectedTags = new Set(selectedTags);
                            if (checked) {
                              newSelectedTags.add(tag);
                            } else {
                              newSelectedTags.delete(tag);
                            }
                            const event_tags_filter: {
                              $and: Array<{
                                event_tags: {
                                  tagName: { $eq: string }
                                }
                              }>
                            } = {$and: []}
                            for (const tag of newSelectedTags) {
                              event_tags_filter.$and.push({
                                event_tags: {
                                  tagName: {
                                    "$eq": tag,
                                  }
                                }
                              });
                            }
                            console.log(event_tags_filter);
                            setNewFilterState({
                              ...newFilterState,
                              filters: {
                                // Preserve the other filter fields e.g. Time Period
                                ...newFilterState.filters,
                                ...event_tags_filter
                              }
                            })
                            setSelectedTags(newSelectedTags)
                          }}/>
                <Label htmlFor={tag}>{tag}</Label>
              </div>)}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>;
}

const defaultEndDate = new Date();
const defaultStartDate = new Date(2020,0, 1);
const defaultOpenTo = "Member";
const defaultTimePeriod: TimePeriod = 'upcoming';
const defaultFilters: EventFilterParams = {
  filters: {
    eventDate: {
      $gte: new Date().toISOString()
    },
    open_to: {
      membershipName: {
        $in: [defaultOpenTo]
      }
    }
  }
};

/**
 * A client component for filtering and ordering events
 * @constructor
 */
export function InteractiveEvents() {
  // const filterEvents = await getEvents();
  const [filters, setFilters] = useState<EventFilterParams>(defaultFilters);
  const [newFilterState, setNewFilterState] = useState<EventFilterParams>(filters);
  const [selectedOpenTo, setSelectedOpenTo] = useState<OpenTo>(defaultOpenTo);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>(defaultTimePeriod);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [customStartDate, setCustomStartDate] = useState<Date>(defaultStartDate);
  const [customEndDate, setCustomEndDate] = useState<Date>(defaultEndDate);
  const [events, setEvents] = useState<EventCardData[]>([]);
  useEffect(() => {
    getEvents(filters).then(r => {
      setEvents(r);
    })
  }, [filters]);
  const extractTags = (eventItems: EventCardData[]) => {
    const eventTags: Set<string> = new Set();
    for (const eventItem of eventItems) {
      for (const tagName of eventItem.eventTags) {
        eventTags.add(tagName);
      }
    }
    return eventTags
  }

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
        <div className={"grid grid-cols-[240px_1fr] w-full gap-4"}>
          <FilterPanel
              filters={filters}
              setFilters={setFilters}
              tags={extractTags(events)}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              newFilterState={newFilterState}
              setNewFilterState={setNewFilterState}
              selectedOpenTo={selectedOpenTo}
              setSelectedOpenTo={setSelectedOpenTo}
              selectedTimePeriod={selectedTimePeriod}
              setSelectedTimePeriod={setSelectedTimePeriod}
              customStartDate={customStartDate}
              setCustomStartDate={setCustomStartDate}
              customEndDate={customEndDate}
              setCustomEndDate={setCustomEndDate}
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
          </div>
        </div>
      </div>);
}