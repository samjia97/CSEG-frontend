import React, {useState} from "react";
import {Button} from "@/components/ui/button";
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
import {Publication} from "@/app/publications/api/get-publications";
import {defaultStartYear, thisYear, yearArray} from "@/app/publications/interactivePublications";

type PublicationsFilterPanelProps = {
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
  initialPublications: Publication[];
  topics: string[];
  startYear: string;
  setStartYear: React.Dispatch<React.SetStateAction<string>>;
  endYear: string;
  setEndYear: React.Dispatch<React.SetStateAction<string>>;
  selectedTopics: Set<string>;
  setSelectedTopics: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export function PublicationsFilterPanel({
                                          topics,
                                          startYear,
                                          setStartYear,
                                          endYear,
                                          setEndYear,
                                          selectedTopics,
                                          setSelectedTopics
                                        }: PublicationsFilterPanelProps) {

  // const filterPublications = (start: string, end: string, topicsSet: Set<string>) => {
  //   setPublications(
  //       initialPublications.filter((value) =>
  //           value.publicationDate <= new Date(parseInt(end, 10), 11, 31) &&
  //           value.publicationDate >= new Date(parseInt(start, 10), 0, 1) &&
  //           (topicsSet.size === 0 || topicsSet.difference(new Set(value.topics)).size === 0)
  //       )
  //   );
  // };

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

  const clearFilters = () => {
    setStartYear(defaultStartYear);
    setEndYear(String(thisYear));
    setSelectedTopics(new Set());
  };

  return (
      <div
          className={"flex flex-col bg-secondary/80 text-secondary-foreground sticky max-h-dvh top-4 rounded-md px-2 py-3 gap-4 overflow-y-auto"}>
        <p className={"text-xl text-center"}>Filter by</p>
        <Button variant={"destructive"} size={"sm"} className={"w-20"}
                onClick={clearFilters}>CLEAR</Button>
        <div>
          <p className={"font-semibold text-lg px-2"}>Year</p>
          <div className={"grid grid-cols-2"}>
            <p className={"pl-1"}>From</p>
            <p className={"pl-1"}>To</p>
            <Select onValueChange={handleStartDateChange} value={startYear}>
              <SelectTrigger className="w-[90px] bg-primary" variant={"simple"} value={startYear}>
                <SelectValue placeholder={startYear}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {yearArray.map((year) => <SelectItem key={String(year)}
                                                       value={String(year)}>{year}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={handleEndDateChange} value={endYear}>
              <SelectTrigger className="w-[90px] bg-primary" variant={"simple"} value={endYear}>
                <SelectValue placeholder={thisYear}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {yearArray.map((year) => <SelectItem key={String(year)}
                                                       value={String(year)}>{year}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className={"[&>svg]:text-white py-0 flex items-center "}><p
                className={"text-lg px-2"}>Topics</p></AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 mt-2">
              {topics.map((tagName) => {
                return (
                    <div key={tagName} className="flex items-center gap-3">
                      <Checkbox id={tagName}
                                value={tagName}
                                checked={selectedTopics.has(tagName)}
                                onCheckedChange={(checked: CheckedState) => {
                                  handleOnChecked(tagName, checked as boolean);
                                }}
                      />
                      <Label htmlFor={tagName}>{tagName}</Label>
                    </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div>
          <p></p>
        </div>
      </div>
  );
}