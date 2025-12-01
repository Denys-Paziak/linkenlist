import { z } from "zod";

export const sectionFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(140, "Title must be no longer than 140 characters")
    .optional(),

  enabled: z.boolean().optional(),
});

export type SectionFormSchemaType = z.infer<typeof sectionFormSchema>;