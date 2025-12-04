"use client"
import React, {useState} from 'react'
import {Publication} from "@/app/publications/api/get-publications";
import {formatDate} from "@/lib/formatters";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
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

type InteractivePublicationsProps = {
  initialPublications: Publication[],
  topics: string[]
}

const thisYear = new Date().getFullYear();
const generateYearArray = (): number[] => {
  const yearArray = [];
  for (let i = thisYear; i >= 2022; i--) {
    yearArray.push(i);
  }
  return yearArray
}
const yearArray = generateYearArray();

/**
 * Handles client side filtering, search and pagination
 * @param publications
 * @constructor
 */
function InteractivePublications({initialPublications, topics}: InteractivePublicationsProps) {
  const [publications, setPublications] = useState(initialPublications);
  const [startYear, setStartYear] = useState("2022");
  const [endYear, setEndYear] = useState(String(thisYear));
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  /**
   * All publications must be on or earlier than 1 January of start Year
   * @param newStartYear
   */
  const handleStartDateChange = (newStartYear: string) => {
    setStartYear(newStartYear);
    // state update is asynchronous so startYear at this point may be the old value. Therefore, use newStartYear
    filterPublications(newStartYear, endYear, selectedTopics);
  }
  /**
   * All publications must be on or before 31 December of end year
   * @param newEndYear
   */
  const handleEndDateChange = (newEndYear: string) => {
    setEndYear(newEndYear);
    filterPublications(startYear, newEndYear, selectedTopics);
  }

  /**
   * When topic checkbox is checked, add topic to selectedTopics set. When uncheked, remove from set.
   * @param tagName
   * @param checked
   */
  const handleOnChecked = (tagName: string, checked: boolean) => {
    const newSelectedTopics = new Set(selectedTopics);
    if (checked) {
      newSelectedTopics.add(tagName);
    } else {
      newSelectedTopics.delete(tagName);
    }
    setSelectedTopics(newSelectedTopics);
    filterPublications(startYear, endYear, newSelectedTopics);
  }
  /**
   * Centralised source of publication filtering
   * @param startYear - publication
   * @param endYear
   * @param newSelectedTopics
   */
  const filterPublications = (startYear: string, endYear: string, newSelectedTopics: Set<string>) => {
    console.log('filtering with ', startYear, endYear, newSelectedTopics);
    setPublications(initialPublications.filter((value) =>
        value.publicationDate <= new Date(parseInt(endYear, 10), 11, 31)
        && value.publicationDate >= new Date(parseInt(startYear, 10), 0, 1)
        && (newSelectedTopics.size === 0 || newSelectedTopics.difference(new Set(value.topics)).size === 0)
    ))
  }

  return (
      <div className={"max-w-7xl w-full grid grid-cols-[220px_1fr] gap-4"}>
        <div
            className={"flex flex-col bg-secondary/80 text-secondary-foreground sticky max-h-dvh top-4 rounded-md px-2 py-3 gap-4 overflow-y-auto"}>
          <p className={"text-xl text-center"}>Filter by</p>
          <div>
            <p className={"font-semibold text-lg px-2"}>Year</p>
            <div className={"grid grid-cols-2"}>
              <p className={"pl-1"}>From</p>
              <p className={"pl-1"}>To</p>
              <Select onValueChange={handleStartDateChange}>
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
              <Select onValueChange={handleEndDateChange}>
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
        <div>
          {publications.map((item) =>
              <div key={item.id} className={"flex flex-col border-b border-neutral-500 py-2"}>
                <p className={"text-lg"}>{item.title}</p>
                <div className={"grid grid-cols-[150px_1fr]"}>
                  <strong>Author</strong>
                  <p>{item.author}</p>
                  <strong>Publication Date</strong>
                  <p>{formatDate(item.publicationDate)}</p>
                  <strong>Topics</strong>
                  <div className={"flex gap-2 pt-1"}>
                    {item.topics.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                  </div>
                </div>
                {item.linkToPublication ?
                    <Link href={item.linkToPublication} className={"underline"}>Link to
                      resource</Link>
                    :
                    <p>No link provided</p>
                }
              </div>)}
        </div>
      </div>
  )
}

export default InteractivePublications
