import {api} from "@/lib/api";
import {getSlug} from "@/lib/utils";
import {getEventTags} from "@/app/events/event-utils";

export type EventCardData = {
  title: string;
  slug: string;
  eventStartDateTime: Date;
  eventEndDateTime: Date;
  eventStartString: string;
  eventEndString: string;
  location: string;
  speaker: string;
  summary: string;
  eventType: string;
  id: number;
  eventTags: string[];
}

const fieldsToGet = 'fields[0]=title' +
    '&fields[1]=id' +
    '&fields[2]=eventDate' +
    '&fields[3]=location' +
    '&fields[4]=speaker' +
    '&fields[5]=summary' +
    '&fields[6]=eventStartTime' +
    '&fields[7]=eventEndTime' +
    '&populate=*' +
    '&sort=eventDate:desc'

/**
 * Gets all events
 */
export async function getEvents() {
  try {
    const url = "/events?" + fieldsToGet
    console.warn(url)
    const res = await api.get("/events?" + fieldsToGet);
    const data = res.data.data;
    const allEvents : EventCardData[] = [];
    for (const eventItem of data) {
      // eventDate must be in ISO format
      const [year, month, day] = eventItem.eventDate.split('T')[0].split('-').map(Number);
      const [startHour, startMinute] = eventItem.eventStartTime.split(":").map(Number);
      const [endHour, endMinute] = eventItem.eventEndTime.split(":").map(Number);
      const eventTags = getEventTags(eventItem);

      allEvents.push(
          {
            id: eventItem.id,
            title: eventItem.title,
            slug: getSlug(eventItem.title, eventItem.documentId),
            eventStartDateTime: new Date(year, month - 1, day, startHour, startMinute),
            eventEndDateTime: new Date(year, month - 1, day, endHour, endMinute),
            eventStartString: eventItem.eventStartTime.toString().substring(0,5),
            eventEndString: eventItem.eventEndTime.toString().substring(0,5),
            location: eventItem.location,
            speaker: eventItem.speaker,
            summary: eventItem.summary,
            eventType: eventItem.event_type.EventType,
            eventTags: eventTags,
          }
      )
    }
    return allEvents
  } catch (e) {
    console.error(e);
    return [];
  }
}

