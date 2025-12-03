"use client"
import React from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

/**
 * When user clicks enter or submit, send search query to url and
 * replace current url with new URL in similar style to filterPanel.tsx
 *
 * Also set page to 1
 * @constructor
 */
export default function SearchBar () {
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const query = formData.get("search") as string;
    const params = new URLSearchParams(currentSearchParams);
    params.set("page", "1")
    if (query){
      params.set("query", query);
    } else {
      params.delete("query")
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
      <form className={"flex gap-2 w-full max-w-[400px]"} onSubmit={handleSubmit}>
        <Input type={"text"} name={"search"} placeholder={"search events"} className={" w-full rounded-none focus-visible:ring-0"}/>
        <Button type={"submit"} variant={"outline"} size={"icon"} aria-label={"Submit"}><Search /></Button>
      </form>
  )
}