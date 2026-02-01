"use client"
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DatePicker1 } from "@/components/ui/date-picker1";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { TimePeriod, OpenTo } from "@/app/events/interactiveEvents";

export type FilterPanelProps = {
  topics: string[];
  timePeriod: TimePeriod;
  setTimePeriod: React.Dispatch<React.SetStateAction<TimePeriod>>;
  openTo: OpenTo;
  setOpenTo: React.Dispatch<React.SetStateAction<OpenTo>>;
  selectedTopics: Set<string>;
  setSelectedTopics: React.Dispatch<React.SetStateAction<Set<string>>>;
  customStartDate: Date;
  setCustomStartDate: React.Dispatch<React.SetStateAction<Date>>;
  customEndDate: Date;
  setCustomEndDate: React.Dispatch<React.SetStateAction<Date>>;
}

/**
 * Simplified client-side filter panel with instant filtering (no APPLY button)
 * Matches the Publications filter panel pattern exactly
 */
export function FilterPanel({
  topics,
  timePeriod,
  setTimePeriod,
  openTo,
  setOpenTo,
  selectedTopics,
  setSelectedTopics,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate
}: FilterPanelProps) {

  const handleTimePeriodChange = (value: TimePeriod) => {
    setTimePeriod(value);
  };

  const handleOpenToChange = (value: OpenTo) => {
    setOpenTo(value);
  };

  const handleStartDateChange = (date: Date) => {
    // Ensure start date is before end date
    const validatedDate = date < customEndDate ? date : customEndDate;
    setCustomStartDate(validatedDate);
  };

  const handleEndDateChange = (date: Date) => {
    // Ensure end date is after start date
    const validatedDate = date > customStartDate ? date : customStartDate;
    setCustomEndDate(validatedDate);
  };

  const handleTopicChange = (topicName: string, checked: boolean) => {
    const newSelectedTopics = new Set(selectedTopics);
    if (checked) {
      newSelectedTopics.add(topicName);
    } else {
      newSelectedTopics.delete(topicName);
    }
    setSelectedTopics(newSelectedTopics);
  };

  return (
    <div className="flex flex-col bg-secondary/80 text-secondary-foreground sticky top-4 max-h-dvh rounded-md px-4 py-3 gap-4 overflow-y-auto">
      <p className="text-xl font-semibold">Filter by</p>

      {/* Time Period */}
      <div>
        <p className="text-lg font-semibold mb-2">Time period</p>
        <RadioGroup value={timePeriod} onValueChange={handleTimePeriodChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upcoming" id="upcoming" />
            <Label htmlFor="upcoming">Upcoming events</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="past" id="past" />
            <Label htmlFor="past">Past events</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All events</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom">Custom time period</Label>
          </div>
        </RadioGroup>

        {/* Custom Date Range */}
        {timePeriod === "custom" && (
          <div className="flex flex-col gap-3 mt-3">
            <DatePicker1
              labelText="From"
              date={customStartDate}
              onSelect={handleStartDateChange}
            />
            <DatePicker1
              labelText="To"
              date={customEndDate}
              onSelect={handleEndDateChange}
            />
          </div>
        )}
      </div>

      {/* Allowed Attendees - NO 'all' option */}
      <Accordion type="single" collapsible defaultValue="attendees">
        <AccordionItem value="attendees">
          <AccordionTrigger className="[&>svg]:text-white py-0">
            <p className="text-lg">Allowed attendees</p>
          </AccordionTrigger>
          <AccordionContent className="mt-2">
            <RadioGroup value={openTo} onValueChange={handleOpenToChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Member" id="Member" />
                <Label htmlFor="Member">Members</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Associate Member" id="Associate_Member" />
                <Label htmlFor="Associate_Member">Associate Members</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Student Member" id="Student_Member" />
                <Label htmlFor="Student_Member">Student Members</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Public Events</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Topics */}
      <Accordion type="single" collapsible>
        <AccordionItem value="topics">
          <AccordionTrigger className="[&>svg]:text-white py-0">
            <p className="text-lg">Topics</p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 mt-2">
            {topics.map((topicName) => (
              <div key={topicName} className="flex items-center gap-3">
                <Checkbox
                  id={topicName}
                  value={topicName}
                  checked={selectedTopics.has(topicName)}
                  onCheckedChange={(checked: CheckedState) => {
                    handleTopicChange(topicName, checked as boolean);
                  }}
                />
                <Label htmlFor={topicName}>{topicName}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

