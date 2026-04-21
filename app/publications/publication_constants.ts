import { z } from "zod";

export const defaultStartYear = "2022";
export const thisYear = new Date().getFullYear();
export const defaultEndYear = String(thisYear);
export const PAGE_SIZE = 50;

export const yearArray: number[] = (() => {
  const arr: number[] = [];
  const oldest = parseInt(defaultStartYear, 10);
  for (let y = thisYear; y >= oldest; y--) arr.push(y);
  return arr;
})();

export const YearSchema = z.string().refine((v) => yearArray.map(String).includes(v));
