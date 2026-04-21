"use client"
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * Simplified search bar that accepts callback prop
 * No URL management - parent writes the query to the URL
 */
export default function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search")?.toString() ?? '';
    onSearch(query);
  };

  return (
    <form className="flex gap-2 w-full max-w-[450px] items-center" onSubmit={handleSubmit}>
      <Input
        type="text"
        name="search"
        placeholder={placeholder}
        className="w-full rounded-none focus-visible:ring-0"
      />
      <Button type="submit" aria-label="Search" size="icon">
        <Search />
      </Button>
    </form>
  );
}
