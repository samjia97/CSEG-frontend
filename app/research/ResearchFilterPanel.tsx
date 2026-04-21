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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import {
  defaultEndYear,
  defaultStartYear,
  defaultStatus,
  ProjectStatus,
  yearArray,
} from "@/app/research/research_constants";

type ResearchFilterPanelProps = {
  startYear: string;
  endYear: string;
  projectStatus: ProjectStatus;
  topics: string[];
  selectedTopics: Set<string>;
  updateParams: (updates: Record<string, string | null>) => void;
};

export function ResearchFilterPanel({
  startYear,
  endYear,
  projectStatus,
  topics,
  selectedTopics,
  updateParams,
}: ResearchFilterPanelProps) {

  const handleStartYearChange = (newStartYear: string) => {
    const clamped = Math.min(parseInt(newStartYear, 10), parseInt(endYear, 10)).toString();
    updateParams({ startYear: clamped === defaultStartYear ? null : clamped });
  };

  const handleEndYearChange = (newEndYear: string) => {
    const clamped = Math.max(parseInt(newEndYear, 10), parseInt(startYear, 10)).toString();
    updateParams({ endYear: clamped === defaultEndYear ? null : clamped });
  };

  const handleStatusChange = (value: string) => {
    const status = value as ProjectStatus;
    updateParams({ status: status === defaultStatus ? null : status });
  };

  const handleTopicChange = (topicName: string, checked: boolean) => {
    const next = new Set(selectedTopics);
    if (checked) next.add(topicName);
    else next.delete(topicName);
    updateParams({ topics: next.size > 0 ? Array.from(next).join(",") : null });
  };

  return (
    <div className="flex flex-col bg-secondary/80 text-secondary-foreground sticky top-4 max-h-dvh rounded-md px-4 py-3 gap-4 overflow-y-auto">
      <p className="text-xl font-semibold">Filter by</p>

      <div>
        <p className="font-semibold text-lg">Start Date</p>
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

      <div>
        <p className="font-semibold text-lg mb-2">Project Status</p>
        <RadioGroup
          value={projectStatus}
          onValueChange={handleStatusChange}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="status-all" />
            <Label htmlFor="status-all">All projects</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ongoing" id="status-ongoing" />
            <Label htmlFor="status-ongoing">Ongoing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="completed" id="status-completed" />
            <Label htmlFor="status-completed">Completed</Label>
          </div>
        </RadioGroup>
      </div>

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
                  onCheckedChange={(checked: CheckedState) =>
                    handleTopicChange(topicName, checked as boolean)
                  }
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
