import { api } from "@/lib/api";
import qs from "qs";
import { z } from "zod";


const LabelSchema = z.object({ labelName: z.string() });
const LabelsResponseSchema = z.object({ data: z.array(LabelSchema) });

const MAX_RECORDS = 99999;

/** Returns the names of all labels, sorted. Throws on failure. */
export async function getLabels(): Promise<string[]> {
  const param = qs.stringify({ fields: ["labelName"], pagination: { pageSize: MAX_RECORDS } });
  const res = await api.get("/labels?" + param);
  const parsed = LabelsResponseSchema.parse(res.data);
  return parsed.data.map((item) => item.labelName).sort();
}
