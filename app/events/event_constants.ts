import {EventFilterParams} from "@/app/events/api/get-events";
import {OpenTo, TimePeriod} from "@/app/events/interactiveEvents";
import {SortOption} from "@/app/events/sortBy";

export const defaultEndDate = new Date();
export const defaultStartDate = new Date(2020, 0, 1);
export const defaultOpenTo = new Set<OpenTo>(['Member','Associate Member']);
export const defaultTimePeriod: TimePeriod = 'upcoming';

