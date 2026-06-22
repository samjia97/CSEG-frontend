"use client"
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
import { TimePeriod } from "@/app/news/news_constants";

export type NewsFilterPanelProps = {
  topics: string[];
  timePeriod: TimePeriod;
  selectedTopics: Set<string>;
  customStartDate: Date;
  customEndDate: Date;
  updateParams: (updates: Record<string, string | null>) => void;
  formatDateParam: (date: Date) => string;
};

export function NewsFilterPanel({
  topics,
  timePeriod,
  selectedTopics,
  customStartDate,
  customEndDate,
  updateParams,
  formatDateParam,
}: NewsFilterPanelProps) {

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
    checked ? next.add(topicName) : next.delete(topicName);
    updateParams({ topics: next.size > 0 ? Array.from(next).join(",") : null });
  };

  return (
    <div className="flex flex-col bg-secondary/80 text-secondary-foreground sticky top-4 max-h-dvh rounded-md px-4 py-3 gap-4 overflow-y-auto">
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
