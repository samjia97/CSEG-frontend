import React, { Suspense } from "react";
import Link from "next/link";
import { getThreads } from "@/app/forum/api/get-threads";
import { getTopics } from "@/lib/get-topics";
import { Button } from "@/components/ui/button";
import { InteractiveForum } from "@/app/forum/interactiveForum";
import { auth } from "@/auth";

export const metadata = {
  title: "Forum",
};

export default async function ForumPage() {
  const session = await auth();
  const token = session?.user?.strapiToken ?? "";
  const [threads, topics] = await Promise.all([getThreads(token), getTopics()]);

  return (
    <main className="p-4 flex flex-col items-center bg-neutral-50">
      <div className="mb-4 w-full max-w-7xl">
        <h2 className="text-center bg-cyan-500/70 rounded-md mb-2">Forum</h2>
        <p>Discuss with members!</p>
      </div>

      <div className="w-full max-w-7xl mb-2 flex justify-end">
        <Button asChild>
          <Link href="/forum/new">Start a new discussion</Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading discussions…</div>}>
        <InteractiveForum initialThreads={threads} topics={topics} />
      </Suspense>
    </main>
  );
}
