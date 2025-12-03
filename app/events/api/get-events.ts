import {api} from "@/lib/api";
import {getSlug} from "@/lib/utils";
import {getEventTags} from "@/app/events/event-utils";
import qs from "qs";

export type GetEventsProps = {
  filter: object,
  sort: string[],
  pagination: {
    page: number,
    pageSize: number,
  }
}

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
  publicEvent: boolean;
  openTo: string[];
}

const baseQuery = {
  fields: [
    'title',
    'id',
    'eventDate',
    'location',
    'speaker',
    'summary',
    'eventStartTime',
    'eventEndTime',
    'publicEvent'
  ],
  populate: '*',
}

export type EventFilterParams = {
  filters: {
    $and?: {event_tags: {
      tagName: {
        $eq: string
      }
      }}[];
    eventDate?: {
      $gte?: string
      $lte?: string
      $between?: string[]
    }
    event_tags?: object,
    open_to?: {
      membershipName?: {
        $in?: string[]
      }
    }
    publicEvent?: {
      $eq?: boolean
    }
  }
  populate?: string | string[]
  sort?: string | string[]
  pagination?: {
    page?: number
    pageSize?: number
  }
}

export type StrapiMeta = {
  pagination: {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number
  }
}


/**
 * Gets all events
 */
export async function getEvents({ filters, sort, pagination }: EventFilterParams): Promise<{
  events: EventCardData[],
  meta: StrapiMeta
}>{
  try {
    const query = qs.stringify(
      {
        ...baseQuery,
        filters: filters,
        sort: sort,
        pagination: pagination,
      }, {
        encodeValuesOnly: true,
        }
    );
    const url = "/events?" + query;
    console.log('url', url);
    const res = await api.get(url);
    const data = res.data.data;
    const allEvents : EventCardData[] = [];
    for (const eventItem of data) {
      // eventDate must be in ISO format - safely parse with fallbacks
      const eventDateStr = eventItem?.eventDate ?? new Date().toISOString();
      const [year, month, day] = eventDateStr.split('T')[0].split('-').map(Number);

      // Safely parse time strings with fallback to "00:00"
      const startTimeStr = eventItem?.eventStartTime ?? "00:00";
      const endTimeStr = eventItem?.eventEndTime ?? "23:59";
      const [startHour, startMinute] = startTimeStr.split(":").map(Number);
      const [endHour, endMinute] = endTimeStr.split(":").map(Number);

      const eventTags = getEventTags(eventItem);
      const openTo = eventItem?.open_to?.map((item: { membershipName: string; }) => item?.membershipName ?? "Member") ?? [];
      openTo.sort();

      allEvents.push(
          {
            id: eventItem?.id ?? 0,
            title: eventItem?.title ?? "Untitled Event",
            slug: eventItem?.title && eventItem?.documentId ? getSlug(eventItem.title, eventItem.documentId) : "untitled-event",
            eventStartDateTime: new Date(year, month - 1, day, startHour, startMinute),
            eventEndDateTime: new Date(year, month - 1, day, endHour, endMinute),
            eventStartString: startTimeStr.toString().substring(0,5),
            eventEndString: endTimeStr.toString().substring(0,5),
            location: eventItem?.location ?? "Location TBA",
            speaker: eventItem?.speaker ?? "Speaker TBA",
            summary: eventItem?.summary ?? "No description available",
            eventType: eventItem?.event_type?.EventType ?? "Event",
            eventTags: eventTags,
            publicEvent: eventItem?.publicEvent ?? false,
            openTo: openTo,
          }
      )
    }
    console.debug("Number of events: ", allEvents.length);
    return {events: allEvents, meta: res.data.meta} ;
  } catch (e) {
    console.error(e);
    return {events: [], meta: {pagination: {page: 1, pageSize: 0, pageCount: 0, total: 0}}} ;
  }
}

