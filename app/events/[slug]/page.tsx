import {getEvent} from "@/app/events/[slug]/api/get-event";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";
import {EmailShareButton, LinkedinShareButton} from "react-share";
import ShareButtons from "@/app/events/[slug]/share-buttons";
import {baseURL} from "@/lib/api";
export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ slug: string }>
}) {
  const {slug} = await params;
  const documentId = slug.substring(slug.lastIndexOf('-')+1);

  const eventData = await getEvent(documentId);

  const dateString = new Intl.DateTimeFormat('en-GB', {
    year:'numeric',
    month:'long',
    day:'numeric'
  }).format(eventData?.eventDate);
  const startTimeString = eventData?.eventStartString.substring(0,5);
  const endTimeString = eventData?.eventEndString.substring(0,5);

  return <main className={"p-4 flex flex-col items-center bg-neutral-50"}>
    <div className={"flex gap-4 self-start mb-4"}>
      <Button asChild>
        <Link href={"/events"}>Back to Events</Link>
      </Button>
      <Breadcrumb className={"bg-neutral-200 px-2"}>
        <BreadcrumbList className={"flex items-center"}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className={"truncate max-w-[600px]"}>{eventData?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    {
      eventData === null ?
          <div></div>
          : <article className={"flex flex-col items-center gap-2  max-w-[1168px]"}>
        <h2 className={"text-2xl"}><span className={"text-accent"}>[{eventData.eventType}]</span> <span>{eventData.title}</span></h2>
        <hr className={"h-3 w-full bg-primary"}/>
        <div className={"grid grid-cols-[1fr_320px] gap-2"}>
          <div className={"bg-white border-r-2 p-4"}>
            <BlocksRenderer content={eventData.eventPage}/>
          </div>
          <div className={"flex flex-col items-start bg-white p-3"}>
            <div className={"grid grid-cols-[80px_1fr] "}>
              <strong>Date</strong><p className={"inline"}>{dateString}</p>
              <strong>Time</strong><p className={"inline"}>{`${startTimeString} - ${endTimeString}`}</p>
              <strong>Location</strong><p className={"inline"}>{eventData.location}</p>
              <strong>Speaker</strong><p className={"inline"}>{eventData.speaker}</p>
              <strong>Topics</strong><p className={"inline"}>PLACEHOLDER</p>
            </div>
            <ShareButtons url={`${baseURL}events/${slug}`}/>
          </div>

        </div>
      </article>
    }

  </main>
}