"use client"
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export type SortOption = "eventDate:desc" | "eventDate:asc" | "title:asc" | "title:desc";

type SortByProps = {
  currentSort: SortOption;
}

export function SortBy({ currentSort }: SortByProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    // Reset to page 1 when changing sort order
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={"flex self-end gap-2 items-center"}>
      <p>Sort by</p>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger
          className="w-[150px] rounded-none border-black drop-shadow-none transition-none focus-visible:ring-0 focus-visible:border-black">
          <SelectValue placeholder={"eventDate:desc"}/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"eventDate:desc"}>New to Old</SelectItem>
          <SelectItem value={"eventDate:asc"}>Old to New</SelectItem>
          <SelectItem value={"title:asc"}>Title A to Z</SelectItem>
          <SelectItem value={"title:desc"}>Title Z to A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

