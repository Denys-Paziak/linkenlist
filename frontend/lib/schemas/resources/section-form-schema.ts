import { z } from "zod";

export const sectionFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(140, "Title must be no longer than 140 characters")
    .optional(),

  enabled: z.boolean().optional(),

  bodyMd: z
    .string()
    .max(10_000, "Content body must be no longer than 10 000 characters")
    .optional()
    .or(z.null()),
});

export type SectionFormSchematype = z.infer<typeof sectionFormSchema>;