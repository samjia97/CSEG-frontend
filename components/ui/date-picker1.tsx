"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {formatDate} from "@/lib/formatters";

export type DatePicker1Props = {
  labelText: string
  date: Date | undefined
  onSelect: (date: Date) => void
}
export function DatePicker1({labelText, date, onSelect}: DatePicker1Props) {
  const [open, setOpen] = React.useState(false);

  return (
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1">
          {labelText}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
            >
              {date ? formatDate(date) : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  onSelect(date ?? new Date());
                  setOpen(false)
                }}
            />
          </PopoverContent>
        </Popover>
      </div>
  )
}
