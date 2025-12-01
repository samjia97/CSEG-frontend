import React from 'react'
import {EventCardData, getEvents} from "@/app/events/api/get-events";
import {InteractiveEvents} from "@/app/events/interactiveEvents";
import {
  Breadcrumb,
  BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";


async function EventsPage() {

  // const allEvents: EventCardData[] = [];
  return (
      <main className={"min-h-screen pt-2 bg-neutral-50 px-4"}>
        <Breadcrumb className={"bg-neutral-200 px-8 w-fit"}>
          <BreadcrumbList className={"text-lg"}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Events</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className={"flex flex-col text-center"}>
          <h1 className={"text-5xl mb-4"}>Events</h1>
          <p>Our events where we learn more about Computer Science Education together.</p>
        </div>
        <div className={"flex justify-center"}>
          <InteractiveEvents/>
        </div>

      </main>
  )
}

export default EventsPage
