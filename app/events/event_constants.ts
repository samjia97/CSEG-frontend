import { z } from "zod";

// ---- Zod schemas for URL param validation ----

export const TimePeriodSchema = z.enum(['upcoming', 'past', 'all', 'custom']);
export type TimePeriod = z.infer<typeof TimePeriodSchema>;
export const defaultTimePeriod: TimePeriod = 'upcoming';

export const OpenToSchema = z.enum(['Public', 'Member', 'Associate Member', 'Student Member']);
export type OpenTo = z.infer<typeof OpenToSchema>;
export type OpenToSelection = Set<OpenTo>;
// Empty set = show all (per matchesOpenTo logic)
export const defaultOpenTo: OpenToSelection = new Set<OpenTo>();

export const SortOptionSchema = z.enum(['eventDate:desc', 'eventDate:asc', 'title:asc', 'title:desc']);
export type SortOption = z.infer<typeof SortOptionSchema>;
export const defaultSortOption: SortOption = 'eventDate:desc';

// ---- Other constants ----

export const PAGE_SIZE = 10;
export const defaultStartDate = new Date(2020, 0, 1);
export const defaultEndDate = new Date();
