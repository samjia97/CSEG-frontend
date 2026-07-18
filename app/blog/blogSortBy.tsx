"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/app/blog/blog_constants";

type BlogSortByProps = {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
};

export function BlogSortBy({ currentSort, onSortChange }: BlogSortByProps) {
  return (
    <div className="flex self-end gap-2 items-center">
      <p>Sort by</p>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[150px] rounded-none border-black drop-shadow-none transition-none focus-visible:ring-0 focus-visible:border-black">
          <SelectValue placeholder="publishDate:desc" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="publishDate:desc">New to Old</SelectItem>
          <SelectItem value="publishDate:asc">Old to New</SelectItem>
          <SelectItem value="title:asc">Title A to Z</SelectItem>
          <SelectItem value="title:desc">Title Z to A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
