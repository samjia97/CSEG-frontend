import {api} from "@/lib/api";
import {BlocksContent} from "@strapi/blocks-react-renderer";
import {getEventTags} from "@/app/events/event-utils";
import qs from "qs";


/**
 * Data for a single event page
 */
export type EventPageData = {
  title: string;
  eventDate: Date;
  eventStartString: string;
  eventEndString: string;
  location: string;
  speaker: string;
  eventType: string;
  eventPage: BlocksContent;
  eventTags: string[];
  publicEvent: boolean;
  openTo: string[];
}

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
    const eventData = res.data.data;
    const eventTags = getEventTags(eventData);
    const openTo = eventData.open_to.map((item: { membershipName: string; }) => item.membershipName);
    return {
      title: eventData?.title ?? "Untitled Event",
      eventDate: eventData?.eventDate ? new Date(eventData.eventDate) : new Date(),
      eventStartString: eventData?.eventStartTime?.toString().substring(0,5) ?? "00:00",
      eventEndString: eventData?.eventEndTime?.toString().substring(0,5) ?? "23:59",
      location: eventData?.location ?? "Location TBA",
      speaker: eventData?.speaker ?? "Speaker TBA",
      eventType: eventData?.event_type?.EventType ?? "Event",
      eventPage: eventData?.eventPage ?? [],
      eventTags: eventTags,
      publicEvent: eventData?.publicEvent ?? false,
      openTo: openTo,
    } as EventPageData;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}