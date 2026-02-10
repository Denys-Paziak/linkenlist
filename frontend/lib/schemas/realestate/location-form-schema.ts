import { z } from "zod";
import { US_STATES } from "../../../constants/real-estate-options";

export const locationFormSchema = z.object({
  street: z
    .string()
    .trim()
    .min(1, "This field is required. Please fill out this field to continue.")
    .max(255, "Max 255 characters"),
  unit: z.string().trim().max(150, "Max 150 characters"),
  city: z
    .string()
    .trim()
    .min(1, "This field is required. Please fill out this field to continue.")
    .max(150, "Max 150 characters"),
  state: z.string().refine((val) => US_STATES.includes(val), "Invalid state"),
  zip: z
    .string()
    .trim()
    .min(1, "This field is required. Please fill out this field to continue.")
    .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
});
