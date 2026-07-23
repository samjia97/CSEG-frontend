import React, { Suspense } from "react";
import Link from "next/link";
import { getBlogs } from "@/app/blog/api/get-blogs";
import { getTopics } from "@/lib/get-topics";
import { getLabels } from "@/lib/get-labels";
import { Button } from "@/components/ui/button";
import { InteractiveBlog } from "@/app/blog/interactiveBlog";
import { auth } from "@/auth";

export const metadata = {
  title: "Blogs",
};

export default async function BlogPage() {
  const session = await auth();
  const token = session?.user?.strapiToken ?? "";
  const [blogs, topics] = await Promise.all([getBlogs(token), getTopics()]);
  let labels: string[] = [];
  try {
    labels = await getLabels();
  } catch (e) {
    console.error("Failed to load labels:", e); // keeps the list resilient if /labels isn't ready
  }

  return (
      <main className="px-4 pb-4 flex flex-col items-center bg-neutral-50">
      <div className="mb-4 w-full max-w-7xl">
        <h2 className="text-center bg-cyan-500/70 rounded-md mb-2 py-2">Blogs</h2>
        <p>Read and discuss the latest from the group.</p>
      </div>

      <div className="w-full max-w-7xl mb-2 flex justify-center">
        <Button asChild className="bg-green-700 hover:bg-green-600 text-white h-12 px-8 font-bold text-2xl">
          <Link href="/blog/new">Write your blog</Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading blogs…</div>}>
        <InteractiveBlog initialBlogs={blogs} topics={topics} labels={labels} />
      </Suspense>
    </main>
  );
}
