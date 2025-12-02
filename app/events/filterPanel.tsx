import {EventFilterParams} from "@/app/events/api/get-events";
import React from "react";
import {Button} from "@/components/ui/button";
import {deepEqual} from "@/lib/utils";
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
  defaultFilters,
  defaultOpenTo,
  defaultStartDate,
  defaultTimePeriod
} from "@/app/events/event_constants";
import {CheckedState} from "@radix-ui/react-checkbox";

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
export function FilterPanel({
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
  const sortedTags = Array.from(tags).sort();
  /**
   * The Time Period radio group change handler
   * @param newValue
   */
  const handleTimePeriodChange = (newValue: TimePeriod) => {
    setSelectedTimePeriod(newValue);
    let newEventDate = {};
    switch (newValue) {
      case 'upcoming':
        newEventDate = {
          $gte: new Date().toISOString()
        }
        break;

      case 'past':
        newEventDate = {
          $lte: new Date().toISOString()
        }
        break;

      case 'all':
        newEventDate = {};
        break;

      case 'custom':
        newEventDate = {
          $between: [customStartDate.toISOString(), customEndDate.toISOString()]
        }
        break;
    }
    setNewFilterState({
      ...newFilterState,
      filters: {
        ...newFilterState.filters,
        eventDate: newEventDate
      }
    });
  }

  /**
   * The Open To radio group change handler
   * @param newValue
   */
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
      filters: {
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
      filters: {
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


  function handleOnChecked(tag: string, checked: boolean) {
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
  }

  return <div
      className={"flex flex-col bg-secondary rounded-md  px-2 py-3 gap-2 text-secondary-foreground min-h-[600px] max-h-dvh overflow-y-auto sticky top-4"}>
    <h3 className={"text-xl text-center"}>Filter by</h3>
    <div className={"flex justify-between my-2"}>
      <Button size={"sm"} variant={"destructive"} onClick={resetFilters}>RESET</Button>
      <Button size={"sm"} onClick={handleApplyFilters}
              disabled={deepEqual(filters, newFilterState)}

      >APPLY FILTERS</Button>
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
                          onCheckedChange={(checked: CheckedState) => {
                            handleOnChecked(tag, checked as boolean);
                          }}
                          />
                <Label htmlFor={tag}>{tag}</Label>
              </div>)}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>;
}