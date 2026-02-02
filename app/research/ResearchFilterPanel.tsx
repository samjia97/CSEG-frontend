"use client"
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { defaultStartYear, thisYear, ProjectStatus } from "@/app/research/research_constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {Checkbox} from "@/components/ui/checkbox";
import {CheckedState} from "@radix-ui/react-checkbox";

type ResearchFilterPanelProps = {
  startYear: string;
  setStartYear: React.Dispatch<React.SetStateAction<string>>;
  endYear: string;
  setEndYear: React.Dispatch<React.SetStateAction<string>>;
  projectStatus: ProjectStatus;
  setProjectStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>;
  topics: string[],
  selectedTopics: Set<string>,
  setSelectedTopics:React.Dispatch<React.SetStateAction<Set<string>>>
};

const generateYearArray = (): number[] => {
  const yearArray = [];
  const startYearInt = parseInt(defaultStartYear);
  for (let i = thisYear; i >= startYearInt; i--) {
    yearArray.push(i);
  }
  return yearArray;
};

export const yearArray = generateYearArray();

export function ResearchFilterPanel({
  startYear,
  setStartYear,
  endYear,
  setEndYear,
  projectStatus,
  setProjectStatus,
  topics,
  selectedTopics,
  setSelectedTopics
}: ResearchFilterPanelProps) {

  const handleStartDateChange = (newStartYear: string) => {
    const validatedNewStartYear = Math.min(parseInt(newStartYear), parseInt(endYear)).toString();
    setStartYear(validatedNewStartYear);
  };

  const handleEndDateChange = (newEndYear: string) => {
    const validatedNewEndYear = Math.max(parseInt(newEndYear), parseInt(startYear)).toString();
    setEndYear(validatedNewEndYear);
  };
  /**
   * Add or delete topics based on checkboxes
   * @param topicName
   * @param checked
   */
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

      <div>
        <p className="font-semibold text-lg">Start Date</p>
        {/* Project start date filter */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <p className="text-sm mb-1">From</p>
            <Select onValueChange={handleStartDateChange} value={startYear}>
              <SelectTrigger className="w-[80px] bg-primary" variant="simple">
                <SelectValue placeholder={startYear} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {yearArray.map((year) => (
                    <SelectItem key={String(year)} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm mb-1">To</p>
            <Select onValueChange={handleEndDateChange} value={endYear}>
              <SelectTrigger className="w-[80px] bg-primary" variant="simple">
                <SelectValue placeholder={String(thisYear)} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {yearArray.map((year) => (
                    <SelectItem key={String(year)} value={String(year)}>
                      {year}
                    </SelectItem>
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
          onValueChange={(value) => setProjectStatus(value as ProjectStatus)}
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
