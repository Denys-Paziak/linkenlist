import { z } from "zod";

const text150 = z.string().max(150).or(z.literal(""));
const text255 = z.string().max(255).or(z.literal(""));

const zip = z
  .string()
  // 12345 або 12345-6789
  .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code")
  .or(z.literal(""));

const state = z.string();

export const locationFormSchema = z.object({
  street: text255,
  unit: text150,
  city: text150,
  state,
  zip,
});
