"use client"
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export type SortOption = "eventDate:desc" | "eventDate:asc" | "title:asc" | "title:desc";

type SortByProps = {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

/**
 * Simplified sort component that accepts callback prop
 * No URL management - matches publications pattern
 */
export function SortBy({ currentSort, onSortChange }: SortByProps) {
  return (
    <div className="flex self-end gap-2 items-center">
      <p>Sort by</p>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[150px] rounded-none border-black drop-shadow-none transition-none focus-visible:ring-0 focus-visible:border-black">
          <SelectValue placeholder="eventDate:desc" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="eventDate:desc">New to Old</SelectItem>
          <SelectItem value="eventDate:asc">Old to New</SelectItem>
          <SelectItem value="title:asc">Title A to Z</SelectItem>
          <SelectItem value="title:desc">Title Z to A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

