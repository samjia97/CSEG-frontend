import { z } from "zod";

export const defaultStartYear = "2015";
export const thisYear = new Date().getFullYear();
export const defaultEndYear = String(thisYear);
export const PAGE_SIZE = 10;

export const ProjectStatusSchema = z.enum(['all', 'ongoing', 'completed']);
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export const defaultStatus: ProjectStatus = 'all';

export const yearArray: number[] = (() => {
  const arr: number[] = [];
  const oldest = parseInt(defaultStartYear, 10);
  for (let y = thisYear; y >= oldest; y--) arr.push(y);
  return arr;
})();

export const YearSchema = z
  .string()
  .refine((v) => yearArray.map(String).includes(v), { message: "invalid year" });
