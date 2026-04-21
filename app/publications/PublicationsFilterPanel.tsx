"use client"
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Label } from "@/components/ui/label";
import {
  defaultEndYear,
  defaultStartYear,
  yearArray,
} from "@/app/publications/publication_constants";

type PublicationsFilterPanelProps = {
  topics: string[];
  startYear: string;
  endYear: string;
  selectedTopics: Set<string>;
  updateParams: (updates: Record<string, string | null>) => void;
};

/**
 * Client-side filter panel.
 * Receives current filter values (read from URL by parent) and a shared
 * updateParams function to write changes back to the URL.
 */
export function PublicationsFilterPanel({
  topics,
  startYear,
  endYear,
  selectedTopics,
  updateParams,
}: PublicationsFilterPanelProps) {

  const handleStartYearChange = (newStartYear: string) => {
    // Ensure start year is before end year
    const clamped = Math.min(parseInt(newStartYear, 10), parseInt(endYear, 10)).toString();
    updateParams({ startYear: clamped === defaultStartYear ? null : clamped });
  };

  const handleEndYearChange = (newEndYear: string) => {
    // Ensure end year is after start year
    const clamped = Math.max(parseInt(newEndYear, 10), parseInt(startYear, 10)).toString();
    updateParams({ endYear: clamped === defaultEndYear ? null : clamped });
  };

  const handleTopicChange = (tagName: string, checked: boolean) => {
    const next = new Set(selectedTopics);
    if (checked) {
      next.add(tagName);
    } else {
      next.delete(tagName);
    }
    updateParams({ topics: next.size > 0 ? Array.from(next).join(",") : null });
  };

  return (
    <div className="flex flex-col bg-secondary/80 text-secondary-foreground sticky top-4 max-h-dvh rounded-md px-4 py-3 gap-4 overflow-y-auto">
      <p className="text-xl font-semibold">Filter by</p>

      {/* Year */}
      <div>
        <p className="font-semibold text-lg">Year</p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <p className="text-sm mb-1">From</p>
            <Select onValueChange={handleStartYearChange} value={startYear}>
              <SelectTrigger className="w-[80px] bg-primary" variant="simple">
                <SelectValue placeholder={startYear} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {yearArray.map((year) => (
                    <SelectItem key={String(year)} value={String(year)}>{year}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm mb-1">To</p>
            <Select onValueChange={handleEndYearChange} value={endYear}>
              <SelectTrigger className="w-[80px] bg-primary" variant="simple">
                <SelectValue placeholder={endYear} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {yearArray.map((year) => (
                    <SelectItem key={String(year)} value={String(year)}>{year}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Topics */}
      <Accordion type="single" collapsible>
        <AccordionItem value="topics">
          <AccordionTrigger className="[&>svg]:text-white py-0 flex items-center">
            <p className="text-lg">Topics</p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 mt-2">
            {topics.map((tagName) => (
              <div key={tagName} className="flex items-center gap-3">
                <Checkbox
                  id={tagName}
                  value={tagName}
                  checked={selectedTopics.has(tagName)}
                  onCheckedChange={(checked: CheckedState) =>
                    handleTopicChange(tagName, checked as boolean)
                  }
                />
                <Label htmlFor={tagName}>{tagName}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
