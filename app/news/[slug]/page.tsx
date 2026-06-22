import { getNewsItem } from "@/app/news/[slug]/api/get-news-item";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { formatDate } from "@/lib/formatters";
import { getDocumentIdFromSlug } from "@/lib/utils";
import { getStrapiImageUrl } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { StyledMarkdown } from "@/components/custom/StyledMarkdown";
import ShareButtons from "@/app/events/[slug]/share-buttons";
import { appURL } from "@/app/constants";

export default async function NewsItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  const item = await getNewsItem(documentId);

  if (!item) {
    return (
      <main className="p-4 flex flex-col items-center bg-neutral-50">
        <div>
          <h2 className="text-2xl">News Item Not Found</h2>
          <p>The news item you are looking for does not exist or has been removed.</p>
        </div>
      </main>
    );
  }

  const pageUrl = `${appURL}/news/${slug}`;

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
              <BreadcrumbLink href="/news">News</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[600px]">{item.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <article className="flex flex-col items-center gap-2 max-w-[1320px] h-full w-full">
        <h1 className="text-2xl">{item.title}</h1>
        <hr className="h-3 w-full bg-primary" />

        <div className="grid grid-cols-[1fr_340px] gap-2 w-full">
          <StyledMarkdown text={item.newsContent} />

          <div className="flex flex-col items-start bg-white p-3 gap-3">
            {item.coverImage && (
              <img
                src={getStrapiImageUrl(item.coverImage.url)}
                alt={item.coverImage.alternativeText ?? item.title}
                className="w-full object-cover rounded"
              />
            )}
            <div className="grid grid-cols-[80px_1fr]">
              <strong>Date</strong>
              <p className="inline">{formatDate(item.publishDate)}</p>
              <strong>Author</strong>
              <p className="inline">{item.author}</p>
              {item.newsTags.length > 0 && (
                <>
                  <strong>Topics</strong>
                  <div className="flex gap-2 flex-wrap">
                    {item.newsTags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                  </div>
                </>
              )}
            </div>

            <ShareButtons url={pageUrl} title={item.title} />
          </div>
        </div>
      </article>
    </main>
  );
}
