"use client";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DatePicker1 } from "@/components/ui/date-picker1";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { POST_TYPE_OPTIONS, TimePeriod } from "@/app/forum/forum_constants";

export type ForumFilterPanelProps = {
  topics: string[];
  timePeriod: TimePeriod;
  selectedTopics: Set<string>;
  selectedPostTypes: Set<string>;
  customStartDate: Date;
  customEndDate: Date;
  updateParams: (updates: Record<string, string | null>) => void;
  formatDateParam: (date: Date) => string;
};

export function ForumFilterPanel({
  topics,
  timePeriod,
  selectedTopics,
  selectedPostTypes,
  customStartDate,
  customEndDate,
  updateParams,
  formatDateParam,
}: ForumFilterPanelProps) {
  const handleTimePeriodChange = (value: TimePeriod) => {
    updateParams({ timePeriod: value === "all" ? null : value });
  };

  const handleStartDateChange = (date: Date) => {
    const validated = date < customEndDate ? date : customEndDate;
    updateParams({ startDate: formatDateParam(validated) });
  };

  const handleEndDateChange = (date: Date) => {
    const validated = date > customStartDate ? date : customStartDate;
    updateParams({ endDate: formatDateParam(validated) });
  };

  const handleTopicChange = (topicName: string, checked: boolean) => {
    const next = new Set(selectedTopics);
    if (checked) next.add(topicName);
    else next.delete(topicName);
    updateParams({ topics: next.size > 0 ? Array.from(next).join(",") : null });
  };

  const handlePostTypeChange = (value: string, checked: boolean) => {
    const next = new Set(selectedPostTypes);
    if (checked) next.add(value);
    else next.delete(value);
    updateParams({ postType: next.size > 0 ? Array.from(next).join(",") : null });
  };

  return (
    <div className="flex flex-col bg-secondary/80 text-secondary-foreground sticky top-4 self-start max-h-dvh rounded-md px-4 py-3 gap-4 overflow-y-auto">
      <p className="text-xl font-semibold">Filter by</p>

      {/* Time Period */}
      <div>
        <p className="text-lg font-semibold mb-2">Time period</p>
        <RadioGroup value={timePeriod === "all" ? "" : timePeriod} onValueChange={handleTimePeriodChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recent" id="recent" />
            <Label htmlFor="recent">Recent (last 12 months)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom">Custom range</Label>
          </div>
        </RadioGroup>

        {timePeriod === "custom" && (
          <div className="flex flex-col gap-3 mt-3">
            <DatePicker1 labelText="From" date={customStartDate} onSelect={handleStartDateChange} />
            <DatePicker1 labelText="To" date={customEndDate} onSelect={handleEndDateChange} />
          </div>
        )}
      </div>

      {/* Post type */}
      <Accordion type="single" collapsible defaultValue="postType">
        <AccordionItem value="postType">
          <AccordionTrigger className="[&>svg]:text-white py-0">
            <p className="text-lg">Post type</p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 mt-2">
            {POST_TYPE_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <Checkbox
                  id={`ptype-${opt.value}`}
                  value={opt.value}
                  checked={selectedPostTypes.has(opt.value)}
                  onCheckedChange={(checked: CheckedState) => {
                    handlePostTypeChange(opt.value, checked as boolean);
                  }}
                />
                <Label htmlFor={`ptype-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Topics */}
      <Accordion type="single" collapsible defaultValue="topics">
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
