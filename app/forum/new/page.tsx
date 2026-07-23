import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NewThreadForm } from "@/app/forum/new/NewThreadForm";
import { getTopicOptions, type TopicOption } from "@/lib/get-topics";

export const metadata = {
  title: "New thread",
};

export default async function NewThreadPage() {
  // Topics are optional — if the taxonomy fetch fails, render the form without them.
  let topics: TopicOption[] = [];
  try {
    topics = await getTopicOptions();
  } catch (e) {
    console.error("Failed to load topics:", e);
  }

  return (
      <main className="px-4 pb-4 flex flex-col items-center bg-neutral-50">
      <div className="flex gap-2 self-start mb-4">
        <Breadcrumb className="bg-neutral-200 px-2">
          <BreadcrumbList className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/forum">Forum</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New thread</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="w-full max-w-[800px]">
        <h1 className="text-2xl mb-4">Start a new discussion</h1>
        <NewThreadForm topics={topics} />
      </div>
    </main>
  );
}
