import { z } from "zod";

const text150 = z.string().trim()
  .min(1, "This field is required. Please fill out this field to continue.").max(150, "Max 150 characters")
const text255 = z.string().trim()
  .min(1, "This field is required. Please fill out this field to continue.").max(255, "Max 255 characters")

const zip = z
  .string()
  .trim()
  .min(1, "This field is required. Please fill out this field to continue.")
  .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code")

const state = z.string();

export const locationFormSchema = z.object({
  street: text255,
  unit: text150,
  city: text150,
  state,
  zip,
});
