import {api} from "@/lib/api";
import {BlocksContent} from "@strapi/blocks-react-renderer";
import {getEventTags} from "@/app/events/event-utils";


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
    const res = await api.get("/events/" + documentId + "?populate=*");
    const eventData = res.data.data;
    const eventTags = getEventTags(eventData);
    const openTo = eventData.open_to.map((item: { membershipName: string; }) => item.membershipName);
    return {
      title: eventData.title,
      eventDate: new Date(eventData.eventDate),
      eventStartString: eventData.eventStartTime.toString().substring(0,5),
      eventEndString: eventData.eventEndTime.toString().substring(0,5),
      location: eventData.location,
      speaker: eventData.speaker,
      eventType: eventData.event_type.EventType,
      eventPage: eventData.eventPage,
      eventTags: eventTags,
      publicEvent: eventData.publicEvent,
      openTo: openTo,
    } as EventPageData;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}