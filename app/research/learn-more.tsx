"use client"
import React, {useState} from 'react'
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
type LearnMoreProps = {
  longSummaryOnLearnMore: string;
  primaryInvestigator: string;
  coInvestigator?: string;
  projectEndDate: Date | null; // ISO 8601 date or null if ongoing
}
function LearnMore({longSummaryOnLearnMore, primaryInvestigator, coInvestigator, projectEndDate}: LearnMoreProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
      <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex flex-col gap-0"
      >
        <div className="flex">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className={"h-20px text-accent"} >
              {isOpen ? "Show less" : "Show more"}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <p>{longSummaryOnLearnMore}</p>
          <div className={"grid grid-cols-[200px_1fr] gap-1"}>
            <span className={"font-bold"}>Primary Investigator:</span>
            <span>{primaryInvestigator}</span>
            {coInvestigator && <>
              <span className={"font-bold"}>Co-Investigator:</span>
              <span>{coInvestigator}</span>
            </>}
            <span className={"font-bold"}>Project End Date:</span>
            <span>{projectEndDate ? projectEndDate.toDateString() : "Ongoing"}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
  )
}

export default LearnMore
