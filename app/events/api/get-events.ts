import {baseURL} from "@/lib/api";
import {getSlug} from "@/lib/utils";
import {getEventTags} from "@/app/events/event-utils";
import qs from "qs";
import {z} from "zod";
const baseQuery = {
  fields: [
    'title',
    'id',
    'eventDate',
    'location',
    'speaker',
    'location',
    'teamsLink',
    'eventFormat',
    'eventStartTime',
    'eventEndTime',
    'publicEvent',
    'eventType'
  ],
  populate: '*',
}
const EventSchema = z.array(
    z.object({
      id: z.number(),
      documentId: z.string(),
      title: z.string(),
      eventDate: z.string(),
      location: z.string().nullable(),
      teamsLink: z.string().nullable(),
      eventFormat: z.string(),
      speaker: z.string(),
      eventStartTime: z.string(),
      eventEndTime: z.string(),
      publicEvent: z.boolean(),
      eventType: z.string(),
      event_tags: z.array(z.object({
        tagName: z.string()
      })).optional(),
      open_to: z.array(z.object({
        membershipName: z.string()
      })).optional()
    }).transform((event) => {
      const eventDateStr = event.eventDate ?? new Date().toISOString();
      const [year, month, day] = eventDateStr.split('T')[0].split('-').map(Number);

      // Safely parse time strings with fallback to "00:00"
      const startTimeStr = event?.eventStartTime ?? "00:00";
      const endTimeStr = event?.eventEndTime ?? "23:59";
      const [startHour, startMinute] = startTimeStr.split(":").map(Number);
      const [endHour, endMinute] = endTimeStr.split(":").map(Number);

      const eventTags = getEventTags(event);
      const openTo = event?.open_to?.map((item: {
        membershipName: string;
      }) => item?.membershipName ?? "Member") ?? [];
      openTo.sort();

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

      return (
          {
            id: event?.id ?? 0,
            title: event?.title ?? "Untitled Event",
            slug: event?.title && event?.documentId ? getSlug(event.title, event.documentId) : "untitled-event",
            eventStartDateTime: new Date(year, month - 1, day, startHour, startMinute),
            eventEndDateTime: new Date(year, month - 1, day, endHour, endMinute),
            eventStartString: startTimeStr.toString().substring(0, 5),
            eventEndString: endTimeStr.toString().substring(0, 5),
            location,
            speaker: event?.speaker,
            // summary: event?.summary ?? undefined,
            eventType: event?.eventType ?? "Event",
            eventTags: eventTags,
            publicEvent: event?.publicEvent ?? false,
            openTo: openTo,
          }
      )
    })
)

export type EventCardData = z.infer<typeof EventSchema>[number];
const MAX_EVENTS_RECORDS = 99999;

/**
 * Gets all events
 */
export async function getEvents(): Promise<EventCardData[]> {
  try {
    const query = qs.stringify(
        {
          ...baseQuery,
          sort: ["eventDate:desc"],
          pagination: {
            pageSize: MAX_EVENTS_RECORDS
          }
        }, {
          encodeValuesOnly: true,
        }
    );
    const url = `${baseURL}/events?${query}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();

    // Validate the data with Zod
    return EventSchema.parse(data.data)
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : 'Unknown error loading events'
    throw new Error(message);
  }
}

