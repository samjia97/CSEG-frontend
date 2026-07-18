import { z } from "zod";

export const TimePeriodSchema = z.enum(["recent", "all", "custom"]);
export type TimePeriod = z.infer<typeof TimePeriodSchema>;
export const defaultTimePeriod: TimePeriod = "all";

export const SortOptionSchema = z.enum([
  "publishDate:desc",
  "publishDate:asc",
  "title:asc",
  "title:desc",
]);
export type SortOption = z.infer<typeof SortOptionSchema>;
export const defaultSortOption: SortOption = "publishDate:desc"; // new → old

export const PAGE_SIZE = 10;
export const defaultStartDate = new Date(2020, 0, 1);
export const defaultEndDate = new Date();
