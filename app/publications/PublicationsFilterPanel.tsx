import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {Checkbox} from "@/components/ui/checkbox";
import {CheckedState} from "@radix-ui/react-checkbox";
import {Label} from "@/components/ui/label";
import {defaultStartYear, thisYear} from "@/app/publications/publication_constants";

type PublicationsFilterPanelProps = {
  topics: string[];
  startYear: string;
  setStartYear: React.Dispatch<React.SetStateAction<string>>;
  endYear: string;
  setEndYear: React.Dispatch<React.SetStateAction<string>>;
  selectedTopics: Set<string>;
  setSelectedTopics: React.Dispatch<React.SetStateAction<Set<string>>>;
};

const generateYearArray = (): number[] => {
  const yearArray = [];
  const startYearInt = parseInt(defaultStartYear);
  for (let i = thisYear; i >= startYearInt; i--) {
    yearArray.push(i);
  }
  return yearArray
}
export const yearArray = generateYearArray();

export function PublicationsFilterPanel({
                                          topics,
                                          startYear,
                                          setStartYear,
                                          endYear,
                                          setEndYear,
                                          selectedTopics,
                                          setSelectedTopics
                                        }: PublicationsFilterPanelProps) {

  const handleStartDateChange = (newStartYear: string) => {
    const validatedNewStartYear = Math.min(parseInt(newStartYear), parseInt(endYear)).toString();
    setStartYear(validatedNewStartYear);
  };

  const handleEndDateChange = (newEndYear: string) => {
    const validatedNewEndYear = Math.max(parseInt(newEndYear), parseInt(startYear)).toString();
    setEndYear(validatedNewEndYear);
  };

  const handleOnChecked = (tagName: string, checked: boolean) => {
    const newSelectedTopics = new Set(selectedTopics);
    if (checked) {
      newSelectedTopics.add(tagName);
    } else {
      newSelectedTopics.delete(tagName);
    }
    setSelectedTopics(newSelectedTopics);
  };

  return (
      <div className="flex flex-col bg-secondary/80 text-secondary-foreground sticky max-h-dvh top-4 rounded-md px-4 py-3 gap-4 overflow-y-auto">
        <p className="text-xl font-semibold">Filter by</p>
        <div>
          <p className="font-semibold text-lg">Year</p>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <p className="text-sm mb-1">From</p>
              <Select onValueChange={handleStartDateChange} value={startYear}>
                <SelectTrigger className="w-[100px] bg-primary" variant="simple">
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
                <SelectTrigger className="w-[100px] bg-primary" variant="simple">
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
                        onCheckedChange={(checked: CheckedState) => {
                          handleOnChecked(tagName, checked as boolean);
                        }}
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
