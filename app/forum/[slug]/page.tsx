import { getThread } from "@/app/forum/[slug]/api/get-thread";
import { getComments } from "@/app/forum/[slug]/api/get-comments";
import { CommentSection } from "@/app/forum/[slug]/comments/CommentSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";
import { formatDate } from "@/lib/formatters";
import { getDocumentIdFromSlug } from "@/lib/utils";
import { StyledMarkdown } from "@/components/custom/StyledMarkdown";
import { POST_TYPE_LABELS } from "@/app/forum/forum_constants";
import { auth } from "@/auth";
import { MarkThreadRead } from "@/app/forum/[slug]/MarkThreadRead";

export default async function ForumThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  const session = await auth();
  const token = session?.user?.strapiToken ?? "";
  const thread = await getThread(documentId, token);

  if (!thread) {
    return (
      <main className="p-4 flex flex-col items-center bg-neutral-50">
        <div>
          <h2 className="text-2xl">Thread Not Found</h2>
          <p>The discussion you are looking for does not exist or has been removed.</p>
        </div>
      </main>
    );
  }

  const { comments, error: commentsError } = await getComments(thread.documentId, token);

  return (
    <main className="p-4 flex flex-col items-center bg-neutral-50">
      <MarkThreadRead threadDocumentId={thread.documentId} />
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
              <BreadcrumbPage className="truncate max-w-[600px]">{thread.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <article className="flex flex-col gap-2 max-w-[1000px] w-full">
        <h1 className="text-2xl">{thread.title}</h1>
        <p className="text-sm text-neutral-500">
          {thread.authorName ? `By ${thread.authorName} - ` : ""}Posted on {formatDate(thread.publishDate)}
        </p>
        {thread.postType && (
          <div className="flex">
            <Badge asChild variant="secondary">
              <Link
                href={`/forum?postType=${thread.postType}`}
                title={`Filter by ${POST_TYPE_LABELS[thread.postType]}`}
                className="cursor-pointer hover:opacity-80"
              >
                {POST_TYPE_LABELS[thread.postType]}
              </Link>
            </Badge>
          </div>
        )}
        {thread.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {thread.topics.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}
        <hr className="h-1 w-full bg-primary" />

        <StyledMarkdown text={thread.body} />

        <CommentSection
          threadDocumentId={thread.documentId}
          initialComments={comments}
          loadError={commentsError}
        />
      </article>
    </main>
  );
}
