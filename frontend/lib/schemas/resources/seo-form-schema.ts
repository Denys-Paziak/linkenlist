import { z } from "zod";

export const seoFormSchema = z.object({
  image: z.string(),

  seoMetaTitle: z
    .string()
    .min(1, "Title cannot be empty")
    .max(140, "Title must be no longer than 140 characters")
    .optional()
    .or(z.literal("")),

  seoMetaDescription: z
    .string()
    .max(200, "Description must be no longer than 200 characters")
    .optional()
    .or(z.literal("")),

  ogImageMode: z.string().min(1, "OG image mode is required").optional(),

  canonicalUrl: z.string().url("Invalid canonical URL").optional().or(z.literal("")),

  allowIndexing: z.boolean().optional(),
});

export type SEOFormSchemaType = z.infer<typeof seoFormSchema>;
