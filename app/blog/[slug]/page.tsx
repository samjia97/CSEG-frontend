import { getBlog } from "@/app/blog/[slug]/api/get-blog";
import { getComments } from "@/app/blog/[slug]/api/get-comments";
import { CommentSection } from "@/app/blog/[slug]/comments/CommentSection";
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
import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/api";
import { auth } from "@/auth";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  const session = await auth();
  const token = session?.user?.strapiToken ?? "";
  const blog = await getBlog(documentId, token);

  if (!blog) {
    return (
      <main className="p-4 flex flex-col items-center bg-neutral-50">
        <div>
          <h2 className="text-2xl">Blog Not Found</h2>
          <p>The blog you are looking for does not exist or has been removed.</p>
        </div>
      </main>
    );
  }

  const { comments, error: commentsError } = await getComments(blog.documentId, token);

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
              <BreadcrumbPage className="truncate max-w-[600px]">{blog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <article className="flex flex-col gap-2 max-w-[1000px] w-full">
        <h1 className="text-2xl">{blog.title}</h1>
        <p className="text-sm text-neutral-500">
          {blog.authorName ? `By ${blog.authorName} - ` : ""}Posted on {formatDate(blog.publishDate)}
        </p>
        {blog.abstract && (
          <p className="text-lg italic text-neutral-700">{blog.abstract}</p>
        )}
        {blog.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {blog.topics.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}
        {blog.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {blog.labels.map((l) => (
              <Badge key={l} asChild variant="secondary">
                <Link
                  href={`/blog?labels=${encodeURIComponent(l)}`}
                  title={`Filter blogs by “${l}”`}
                  className="cursor-pointer hover:opacity-80"
                >
                  {l}
                </Link>
              </Badge>
            ))}
          </div>
        )}
        {blog.coverImage && (
          <Image
            src={getStrapiImageUrl(blog.coverImage.url)}
            alt={blog.coverImage.alternativeText ?? blog.title}
            width={blog.coverImage.width}
            height={blog.coverImage.height}
            sizes="(max-width: 1024px) 100vw, 1000px"
            className="w-full h-auto rounded"
          />
        )}
        <hr className="h-1 w-full bg-primary" />

        <StyledMarkdown text={blog.body} extended />

        {blog.authorBio && (
          <aside className="mt-4 rounded border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-semibold">About {blog.authorName ?? "the author"}</p>
            <p className="mt-1 text-sm text-neutral-700 whitespace-pre-wrap">{blog.authorBio}</p>
          </aside>
        )}

        <CommentSection
          blogDocumentId={blog.documentId}
          initialComments={comments}
          loadError={commentsError}
        />
      </article>
    </main>
  );
}
