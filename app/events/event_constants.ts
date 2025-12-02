import {EventFilterParams} from "@/app/events/api/get-events";
import {TimePeriod} from "@/app/events/interactiveEvents";

export const defaultEndDate = new Date();
export const defaultStartDate = new Date(2020, 0, 1);
export const defaultOpenTo = "Member";
export const defaultTimePeriod: TimePeriod = 'upcoming';
export const defaultFilters: EventFilterParams = {
  filters: {
    eventDate: {
      $gte: new Date().toISOString()
    },
    open_to: {
      membershipName: {
        $in: [defaultOpenTo]
      }
    }
  }
};