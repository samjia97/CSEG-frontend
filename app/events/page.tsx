import React, { Suspense } from 'react'
import { getEvents } from "@/app/events/api/get-events";
import { InteractiveEvents } from "@/app/events/interactiveEvents";
import { getTopics } from "@/lib/get-topics";

/**
 * Events page - fetches all events and topics, passes to client component for filtering
 * Matches publications page pattern exactly
 */
async function EventsPage() {
  const events = await getEvents();
  const topics = await getTopics();

  return (
    <>
      <div className="mb-4">
        <h2 className="text-center bg-cyan-500/70 rounded-md mb-2">Events</h2>
        <p>Our events where we learn more about Computer Science Education together.</p>
      </div>
      <div className="flex justify-center">
        <Suspense fallback={<div>Loading events...</div>}>
          <InteractiveEvents initialEvents={events} topics={topics} />
        </Suspense>
      </div>
    </>
  )
}

export default EventsPage;

export const metadata = {
  title: "Events"
}
