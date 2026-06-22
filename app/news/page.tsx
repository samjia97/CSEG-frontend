import React, { Suspense } from "react";
import { getNews } from "@/app/news/api/get-news";
import { getTopics } from "@/lib/get-topics";
import { InteractiveNews } from "@/app/news/interactiveNews";

async function NewsContent() {
  const news = await getNews();
  const topics = await getTopics();

  return (
    <>
      <div className="mb-4">
        <h2 className="text-center bg-cyan-500/70 rounded-md mb-2">News</h2>
        <p>Exciting updates regarding the CSE group- stay tuned!</p>
      </div>
      <div className="flex justify-center">
        <Suspense fallback={<div>Loading news...</div>}>
          <InteractiveNews initialNews={news} topics={topics} />
        </Suspense>
      </div>
    </>
  );
}

export default NewsContent;

export const metadata = {
  title: "News",
};
