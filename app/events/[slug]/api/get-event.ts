import {api} from "@/lib/api";
import {getEventTags} from "@/app/events/event-utils";
import qs from "qs";
import {z} from "zod";

// Zod schema for single event validation and transformation
// Zod schema for single event validation and transformation
const EventPageSchema = z.object({
  title: z.string(),
  eventDate: z.string(),
  eventStartTime: z.string(),
  eventEndTime: z.string(),
  location: z.string().nullable(),
  teamsLink: z.string().nullable(),
  eventFormat: z.string(),
  speaker: z.string(),
  eventType: z.string().nullable(),
  eventPage: z.string(), // BlocksContent type
  publicEvent: z.boolean(),
  event_tags: z.array(z.object({
    tagName: z.string()
  })).optional(),
  open_to: z.array(z.object({
    membershipName: z.string()
  })),
  markdownTest: z.string().nullable().optional()
}).transform((event) => {
  const eventTags = getEventTags(event);
  const openTo = event.open_to.map((item) => item.membershipName);

  const eventFormatLower = event.eventFormat.toLowerCase();
  let location: string | null;
  if (eventFormatLower.includes('hybrid')) {
    location = `Hybrid in person at ${event.location} and online at ${event.teamsLink}`
  } else if (eventFormatLower.includes('online')) {
    location = `Online at ${event.teamsLink}`
  } else if (eventFormatLower.includes('person')) {
    location = `In person at ${event.location}`
  } else {
    location = null;
  }

  return {
    title: event.title,
    eventDate: new Date(event.eventDate),
    eventStartString: event.eventStartTime.substring(0, 5),
    eventEndString: event.eventEndTime.substring(0, 5),
    location,
    speaker: event.speaker,
    eventType: event.eventType ?? "Event",
    eventPage: event.eventPage,
    eventTags: eventTags,
    publicEvent: event.publicEvent,
    openTo: openTo,
    markdownTest: event.markdownTest ?? undefined,
  };
});

/**
 * Data for a single event page
 */
export type EventPageData = z.infer<typeof EventPageSchema>;

/**
 * Gets singular event
 */
export async function getEvent(documentId: string):Promise<EventPageData | null> {
  try {
    const query = qs.stringify(
      {
        populate: '*',
      },
      {
        encodeValuesOnly: true,
      }
    );
    const res = await api.get(`/events/${documentId}?${query}`);
    // Validate and transform with Zod
    const eventData = EventPageSchema.parse(res.data.data);
    return eventData;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}