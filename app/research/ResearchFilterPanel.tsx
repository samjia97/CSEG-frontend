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

type ResearchFilterPanelProps = {
  startYear: string;
  setStartYear: React.Dispatch<React.SetStateAction<string>>;
  endYear: string;
  setEndYear: React.Dispatch<React.SetStateAction<string>>;
  projectStatus: ProjectStatus;
  setProjectStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>;
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
  setProjectStatus
}: ResearchFilterPanelProps) {

  const handleStartDateChange = (newStartYear: string) => {
    const validatedNewStartYear = Math.min(parseInt(newStartYear), parseInt(endYear)).toString();
    setStartYear(validatedNewStartYear);
  };

  const handleEndDateChange = (newEndYear: string) => {
    const validatedNewEndYear = Math.max(parseInt(newEndYear), parseInt(startYear)).toString();
    setEndYear(validatedNewEndYear);
  };

  return (
    <div className="flex flex-col bg-secondary/80 text-secondary-foreground sticky top-4 max-h-dvh rounded-md px-4 py-3 gap-4 overflow-y-auto">
      <p className="text-xl font-semibold">Filter by</p>

      <div>
        <p className="font-semibold text-lg">Year (Start Date)</p>
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
    </div>
  );
}
