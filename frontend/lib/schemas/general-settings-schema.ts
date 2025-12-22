import { z } from "zod";

export const generalSettingsSchema = z.object({
  siteName: z
    .string()
    .trim()
    .min(1, "Site name is required.")
    .max(100, "Max 100 characters."),

  siteDescription: z
    .string()
    .trim()
    .max(500, "Max 500 characters."),
});
