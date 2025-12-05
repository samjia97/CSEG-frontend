"use client"
import React, {useState} from 'react'
import {Button} from "@/components/ui/button";

type LearnMoreProps = {
  summary: string;
}
const MAX_LENGTH = 400;
function LearnMore({summary}: LearnMoreProps) {
  const [isOpen, setIsOpen] = useState(false);
  let truncatePoint = -1;
  let shortSummary = "";
  if (summary.length >= MAX_LENGTH){
    truncatePoint = Math.max(summary.indexOf(' ', MAX_LENGTH), 400)
    shortSummary = summary.slice(0, truncatePoint);
  } else {
    shortSummary = summary;
  }
  return (
      <div>
        {!isOpen ? <p><span>{shortSummary}</span><Button variant="link" className={"h-20px text-primary inline"} onClick={()=> setIsOpen(true)} hidden={truncatePoint == -1 || isOpen}>Show more</Button></p> : <p>{summary}<Button variant="link" className={"h-20px text-primary inline"} onClick={() => setIsOpen(false)} >Show less</Button></p>}
      </div>
  )
}

export default LearnMore
