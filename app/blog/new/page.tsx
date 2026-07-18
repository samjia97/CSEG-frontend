import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NewBlogForm } from "@/app/blog/new/NewBlogForm";
import { getTopicOptions, type TopicOption } from "@/lib/get-topics";
import { getLabels } from "@/lib/get-labels";

export const metadata = {
  title: "New blog",
};

export default async function NewBlogPage() {
  // Topics and labels are optional.
  let topics: TopicOption[] = [];
  let labels: string[] = [];
  try {
    topics = await getTopicOptions();
  } catch (e) {
    console.error("Failed to load topics:", e);
  }
  try {
    labels = await getLabels();
  } catch (e) {
    console.error("Failed to load labels:", e);
  }

  return (
    <main className="p-4 flex flex-col items-center bg-neutral-50">
      <div className="flex gap-2 self-start mb-4">
        <Breadcrumb className="bg-neutral-200 px-2">
          <BreadcrumbList className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">Blogs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="w-full max-w-[800px]">
        <h1 className="text-2xl mb-4">Write a new blog</h1>
        <NewBlogForm topics={topics} labels={labels} />
      </div>
    </main>
  );
}
