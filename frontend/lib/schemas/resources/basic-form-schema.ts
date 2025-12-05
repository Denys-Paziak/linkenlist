import { z } from "zod";

export const resourceCategories = [
  "software",
  "finance",
  "military",
  "housing",
  "travel",
  "education",
  "health",
  "retail",
] as const;

export const resourceFormats = ["guide", "checklist", "tool", "pdf"];

export const basicFormSchema = z.object({
  image: z.string().min(1, "Image is required"),
  featuredDealId: z.number().optional().or(z.literal(null)),

  title: z
    .string()
    .min(1, "Title is required")
    .max(140, "Title must be no longer than 140 characters")
    .refine((v) => !v || v.trim().length > 0, {
      message: "Title cannot be empty",
    }),

  slug: z
    .string()
    .max(140, "Slug must be no longer than 140 characters")
    .regex(/^[a-z0-9-_]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, hyphens, and underscores.",
    })
    .optional()
    .or(z.literal("")),

  teaser: z
    .string()
    .max(200, "Teaser must be no longer than 200 characters")
    .optional()
    .or(z.literal("")),

  categories: z
    .array(z.enum(resourceCategories))
    .min(1, "At least one category is required"),

  format: z.string().min(1, "Resource type is required"),

  tags: z
    .array(
      z
        .string()
        .regex(/^[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/, {
          message:
            "Tags can only contain letters, numbers, spaces, and special characters",
        })
        .min(2, "Each tag must be between 2 and 30 characters long")
        .max(30, "Each tag must be between 2 and 30 characters long")
    )
    .max(10, "You can specify up to 10 tags")
    .optional()
    .or(z.literal(null)),
});

export type BasicFormSchemaType = z.infer<typeof basicFormSchema>;
